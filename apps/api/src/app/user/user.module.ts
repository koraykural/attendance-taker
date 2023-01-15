import { UserController } from '@api/app/user/user.controller';
import { User } from '@api/app/user/user.entity';
import { UserService } from '@api/app/user/user.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
