import { Module } from '@nestjs/common';
import { OrganizationModule } from './organization/organization.module';
import { AppController } from './app.controller';
import { RealTimeGateway } from './realtime.gateway';
import { AuthModule } from '@api/app/auth/auth.module';
import { UserModule } from '@api/app/user/user.module';
import { SessionModule } from '@api/app/session/session.module';

@Module({
  imports: [AuthModule, UserModule, SessionModule, OrganizationModule],
  controllers: [AppController],
  providers: [RealTimeGateway],
})
export class AppModule {}
