import { CurrentUser } from '@api/app/auth/current-user.decorator';
import { IsOrganizationUser } from '@api/app/organization/guard/organization-user.guard';
import { OrganizationUserRole } from '@api/app/organization/organization-user.entity';
import { User } from '@api/app/user/user.entity';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateSessionDto } from '@api/app/session/create-session.dto';
import { SessionService } from '@api/app/session/session.service';

@Controller('session')
export class SessionController {
  @Inject()
  private readonly sessionService: SessionService;

  @Post()
  @IsOrganizationUser(OrganizationUserRole.Admin, OrganizationUserRole.Owner)
  createSession(@CurrentUser() user: User, @Body() createSessionDto: CreateSessionDto) {
    return this.sessionService.createSession(user, createSessionDto);
  }
}
