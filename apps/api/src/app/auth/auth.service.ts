import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@api/app/user/user.service';
import { User } from '@api/app/user/user.entity';
import { compare, hash } from '@api/app/auth/password-utils';
import { PostgresError } from 'pg-error-enum';

@Injectable()
export class AuthService {
  @Inject()
  private readonly userService: UserService;
  @Inject()
  private readonly jwtService: JwtService;

  async validateUser(email: string, password: string): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.userService.findByEmail(email);
    if (user && compare(password, user.passwordHash)) {
      user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(params: { email: string; password: string; firstName: string; lastName: string }) {
    try {
      const { email, password, firstName, lastName } = params;
      const passwordHash = hash(password);
      const user = new User();
      Object.assign(user, { email, passwordHash, firstName, lastName });
      await user.save();
      return user;
    } catch (error: any) {
      if (error.code === PostgresError.UNIQUE_VIOLATION) {
        throw new BadRequestException('Email already in use');
      }
      throw error;
    }
  }
}
