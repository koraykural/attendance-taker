import { Module } from '@nestjs/common';
import { OrganizationModule } from './organization/organization.module';
import { AppController } from './app.controller';
import { AuthModule } from '@api/app/auth/auth.module';
import { UserModule } from '@api/app/user/user.module';
import { SessionModule } from '@api/app/session/session.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from '@api/config/ormconfig';

@Module({
  imports: [
    AuthModule,
    UserModule,
    SessionModule,
    OrganizationModule,
    TypeOrmModule.forRoot(ormconfig.options),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
