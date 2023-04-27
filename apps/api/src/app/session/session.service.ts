import { Session } from '@api/app/session/session.entity';
import { User } from '@api/app/user/user.entity';
import { CreateSessionDto } from '@interfaces/session';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Redis } from 'ioredis';
import { Repository } from 'typeorm';

@Injectable()
export class SessionService {
  @InjectRepository(Session)
  private readonly sessionRepository: Repository<Session>;
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

  /** Save id of session to Redis */
  async saveSessionIdToRedis(session: Session) {
    await this.redis.set(session.id, session.id);
  }

  async endSession(sessionId: string) {
    await this.sessionRepository.update({ id: sessionId }, { endedAt: new Date() });
  }
}
