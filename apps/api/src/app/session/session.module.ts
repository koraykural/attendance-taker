import { OrganizationUser } from '@api/app/organization/organization-user.entity';
import { OrganizationModule } from '@api/app/organization/organization.module';
import { RedisModule } from '@api/app/redis/redis.module';
import { SessionAttendee } from '@api/app/session/session-attendee.entity';
import { SessionController } from '@api/app/session/session.controller';
import { Session } from '@api/app/session/session.entity';
import { SessionGateway } from '@api/app/session/session.gateway';
import { SessionService } from '@api/app/session/session.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganizationUser, Session, SessionAttendee]),
    OrganizationModule,
    RedisModule,
  ],
  controllers: [SessionController],
  providers: [SessionService, SessionGateway],
})
export class SessionModule {}
