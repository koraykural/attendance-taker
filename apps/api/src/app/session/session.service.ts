import { SessionAttendee } from '@api/app/session/session-attendee.entity';
import { Session } from '@api/app/session/session.entity';
import { User } from '@api/app/user/user.entity';
import {
  AttendedSessionListResponseItem,
  CreateSessionDto,
  SessionDetails,
  SessionListResponseItem,
} from '@interfaces/session';
import { SESSION_ACTIVE_TIME_MS, CODE_ACTIVE_TIME_MS, CODE_GRACE_TIME_MS } from '@consts/session';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Redis } from 'ioredis';
import { v4 as uuidV4 } from 'uuid';
import { Repository } from 'typeorm';
import { Observable, finalize, switchMap, take, takeWhile, timer } from 'rxjs';
import { pick } from 'lodash';

type RawSessionListItem = {
  id: string;
  name: string;
  createdAt: Date;
  endedAt: Date | null;
  attendeeCount: string;
};

@Injectable()
export class SessionService {
  @InjectRepository(Session)
  private readonly sessionRepository: Repository<Session>;
  @InjectRepository(SessionAttendee)
  private readonly sessionAttendeeRepository: Repository<SessionAttendee>;
  @Inject()
  private readonly redis: Redis;

  async createSession(user: User, createSessionDto: CreateSessionDto) {
    let session = new Session();
    Object.assign(session, {
      ...createSessionDto,
      createdById: user.id,
    });
    session = await session.save();
    return session;
  }

  getSession(sessionId: string) {
    return this.sessionRepository.findOne({ where: { id: sessionId } });
  }

  async getSessionForUser(user: User, sessionId: string) {
    const session = await this.getSession(sessionId);

    if (!session) throw new NotFoundException();

    const orgUsers = await user.organizations;

    if (!orgUsers?.some((orgUser) => orgUser.organizationId === session.organizationId)) {
      throw new UnauthorizedException('User and session are not in the same organization');
    }

    return session;
  }

  async listSessionsICreated(
    user: User,
    organizationId: string
  ): Promise<SessionListResponseItem[]> {
    const rawResult = await this.sessionRepository.query(
      `
      SELECT id, name, "createdAt", "endedAt", COUNT(sa."userId") as "attendeeCount"
      FROM sessions s
      LEFT JOIN session_attendees sa ON s.id = sa."sessionId"
      WHERE s."organizationId" = $1 AND s."createdById" = $2
      GROUP BY id, name, "createdAt", "endedAt"
      ORDER BY "createdAt" DESC`,
      [organizationId, user.id]
    );

    return rawResult.map((item: RawSessionListItem) => ({
      ...pick(item, ['id', 'name', 'createdAt', 'endedAt']),
      attendeeCount: parseInt(item.attendeeCount),
    }));
  }

  async listSessionsIAttended(user: User): Promise<AttendedSessionListResponseItem[]> {
    const rawResult = await this.sessionAttendeeRepository.query(
      `
      SELECT s.name, sa."attendedAt"
      FROM session_attendees sa
      JOIN sessions s ON sa."sessionId" = s.id
      WHERE sa."userId" = $1
      ORDER BY sa."attendedAt" DESC`,
      [user.id]
    );

    return rawResult.map((item: AttendedSessionListResponseItem) => ({
      ...pick(item, ['name', 'attendedAt']),
    }));
  }

  async terminateSession(session: Session) {
    await Promise.all([
      session.terminateSession(),
      this.redis.get(session.id).then(async (code) => {
        if (code) {
          await this.redis.del(session.id);
          await this.redis.del(code);
        }
      }),
    ]);
  }

  async getSessionDetails(session: Session): Promise<SessionDetails> {
    const [attendeesRaw, organization, createdBy] = await Promise.all([
      session.attendees,
      session.organization,
      session.createdBy,
    ]);

    const attendees = await Promise.all(
      attendeesRaw.map(async (attendee) => {
        const user = await attendee.user;

        return {
          userId: attendee.userId,
          email: user.email,
          fullName: `${user.firstName} ${user.lastName}`,
          attendedAt: attendee.attendedAt,
        };
      })
    );

    return {
      id: session.id,
      name: session.name,
      createdByEmail: createdBy.email,
      createdByFullName: `${createdBy.firstName} ${createdBy.lastName}`,
      createdAt: session.createdAt,
      endedAt: session.endedAt,
      organizationId: session.organizationId,
      organizationName: organization.name,
      attendees,
    };
  }

  async attendSession(attendanceCode: string, user: User) {
    if (!attendanceCode.startsWith('code-'))
      throw new BadRequestException('Invalid attendance code');
    const sessionId = await this.redis.get(attendanceCode);
    if (!sessionId) throw new BadRequestException('Invalid attendance code');
    const session = await this.getSessionForUser(user, sessionId);
    const alreadyAttended = await this.sessionAttendeeRepository.exist({
      where: { userId: user.id, sessionId: session.id },
    });
    if (alreadyAttended) throw new BadRequestException('Already attended');
    await this.sessionAttendeeRepository.save({ userId: user.id, sessionId: session.id });

    return {
      sessionName: session.name,
    };
  }

  serveSessionAttendanceCodes(sessionId: string): Observable<{ active: boolean; code?: string }> {
    const takeCount = SESSION_ACTIVE_TIME_MS / CODE_ACTIVE_TIME_MS;
    return timer(0, CODE_ACTIVE_TIME_MS).pipe(
      take(takeCount),
      switchMap(() => this.getSession(sessionId)),
      takeWhile((session: Session | null) => !!session),
      switchMap(async (session) => {
        if (session?.endedAt) return { active: false };

        const code = await this.updateAttendanceCode(sessionId);

        return { active: true, code };
      }),
      finalize(async () => {
        const session = await this.getSession(sessionId);
        if (session) {
          await this.terminateSession(session);
        }
      })
    );
  }

  async updateAttendanceCode(sessionId: string) {
    const attendanceCode = `code-${uuidV4()}`;
    const expireInSeconds = (CODE_GRACE_TIME_MS + CODE_ACTIVE_TIME_MS) / 1000;
    await Promise.all([
      this.redis.setex(sessionId, expireInSeconds, attendanceCode),
      this.redis.setex(attendanceCode, expireInSeconds, sessionId),
    ]);
    return attendanceCode;
  }
}
