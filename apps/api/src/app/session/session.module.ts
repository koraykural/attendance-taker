import { OrganizationUser } from '@api/app/organization/organization-user.entity';
import { SessionAttandee } from '@api/app/session/session-attandee.entity';
import { SessionController } from '@api/app/session/session.controller';
import { Session } from '@api/app/session/session.entity';
import { SessionService } from '@api/app/session/session.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationUser, Session, SessionAttandee])],
  controllers: [SessionController],
  providers: [SessionService],
})
export class SessionModule {}
