import { SessionAttandee } from '@api/app/session/session-attandee.entity';
import { Session } from '@api/app/session/session.entity';
import { User } from '@api/app/user/user.entity';
import { CreateSessionDto } from '@interfaces/session';
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

@Injectable()
export class SessionService {
  @InjectRepository(Session)
  private readonly sessionRepository: Repository<Session>;
  @InjectRepository(SessionAttandee)
  private readonly sessionAttandeeRepository: Repository<SessionAttandee>;
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

  listMySessions(user: User, organizationId: string) {
    return this.sessionRepository.find({
      where: { organizationId, createdById: user.id },
      select: ['id', 'name', 'createdAt'],
    });
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

  async getSessionDetails(session: Session) {
    const attendeeCount = await this.sessionAttandeeRepository.count({
      where: { sessionId: session.id },
    });
    return { ...session, attendeeCount };
  }

  async attendSession(attendanceCode: string, user: User) {
    if (!attendanceCode.startsWith('code-'))
      throw new BadRequestException('Invalid attendance code');
    const sessionId = await this.redis.get(attendanceCode);
    if (!sessionId) throw new Error('Invalid attendance code');
    const session = await this.getSessionForUser(user, sessionId);
    const alreadyAttended = await this.sessionAttandeeRepository.exist({
      where: { userId: user.id, sessionId: session.id },
    });
    if (alreadyAttended) throw new BadRequestException('Already attended');
    await this.sessionAttandeeRepository.save({ userId: user.id, sessionId: session.id });
  }

  serveSessionAttendanceCodes(sessionId: string): Observable<string> {
    const takeCount = SESSION_ACTIVE_TIME_MS / CODE_ACTIVE_TIME_MS;
    return timer(0, CODE_ACTIVE_TIME_MS).pipe(
      take(takeCount),
      switchMap(() => this.getSession(sessionId)),
      takeWhile((session: Session | null) => {
        return !!session && !session.endedAt;
      }),
      switchMap(() => this.updateAttendanceCode(sessionId)),
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
