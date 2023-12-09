import { CurrentUser } from '@api/app/auth/current-user.decorator';
import { IsOrganizationUser } from '@api/app/organization/guard/organization-user.guard';
import { User } from '@api/app/user/user.entity';
import { Body, Controller, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common';
import { SessionService } from '@api/app/session/session.service';
import { OrganizationUserRole } from '@interfaces/organization';
import { CreateSessionDto, CreateSessionResponseDto } from '@interfaces/session';
import { CurrentSession, SessionGuard } from '@api/app/session/guard/session.guard';
import { SessionOwnerGuard } from '@api/app/session/guard/session-owner.guard';
import { Session } from '@api/app/session/session.entity';

@Controller('session')
export class SessionController {
  @Inject()
  private readonly sessionService: SessionService;

  @Post()
  @IsOrganizationUser(OrganizationUserRole.Admin, OrganizationUserRole.Owner)
  async createSession(
    @CurrentUser() user: User,
    @Body() createSessionDto: CreateSessionDto
  ): Promise<CreateSessionResponseDto> {
    const session = await this.sessionService.createSession(user, createSessionDto);
    return { sessionId: session.id };
  }

  @Put(':sessionId/terminate')
  @UseGuards(SessionGuard, SessionOwnerGuard)
  async terminateSession(@CurrentSession() session: Session) {
    await this.sessionService.terminateSession(session);
  }

  @Put(':sessionId/reopen')
  @UseGuards(SessionGuard, SessionOwnerGuard)
  async reopenSession(@CurrentSession() session: Session) {
    if (!session.endedAt) throw new Error('Session is already open');
    await session.reopenSession();
  }

  @Post('attend/:attendanceCode')
  attendSession(@CurrentUser() user: User, @Param('attendanceCode') attendanceCode: string) {
    return this.sessionService.attendSession(attendanceCode, user);
  }

  @Get('organization/:organizationId')
  listMySessions(@CurrentUser() user: User, @Param('organizationId') organizationId: string) {
    return this.sessionService.listMySessions(user, organizationId);
  }

  @Get(':sessionId')
  @UseGuards(SessionGuard, SessionOwnerGuard)
  getSession(@CurrentSession() session: Session) {
    return this.sessionService.getSessionDetails(session);
  }
}
