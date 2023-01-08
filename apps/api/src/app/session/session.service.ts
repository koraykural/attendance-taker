import { CreateSessionDto } from '@api/app/session/create-session.dto';
import { Session } from '@api/app/session/session.entity';
import { User } from '@api/app/user/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionService {
  async createSession(user: User, createSessionDto: CreateSessionDto) {
    const session = new Session();
    Object.assign(session, {
      ...createSessionDto,
      createdById: user.id,
    });
    await session.save();
  }
}
