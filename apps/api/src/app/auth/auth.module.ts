import { AuthController } from '@api/app/auth/auth.controller';
import { AuthService } from '@api/app/auth/auth.service';
import { JwtAuthGuard } from '@api/app/auth/jwt-auth.guard';
import { JwtStrategy } from '@api/app/auth/jwt.strategy';
import { LocalStrategy } from '@api/app/auth/local.strategy';
import { UserModule } from '@api/app/user/user.module';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({ secret: 'JWT_SECRET' }), // TODO:
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
