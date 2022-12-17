import { AuthService } from '@api/app/auth/auth.service';
import { CurrentUser } from '@api/app/auth/current-user.decorator';
import { SkipAuth } from '@api/app/auth/skip-auth';
import { User } from '@api/app/user/user.entity';
import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
@SkipAuth()
export class AuthController {
  @Inject()
  private readonly authService: AuthService;

  @Post('login')
  @UseGuards(AuthGuard('local'))
  login(@CurrentUser() user: User) {
    return this.authService.login(user);
  }

  @Post('register')
  async register(
    @Body() body: Pick<User, 'email' | 'firstName' | 'lastName'> & { password: string }
  ) {
    const user = await this.authService.register(body);
    return this.authService.login(user);
  }
}
