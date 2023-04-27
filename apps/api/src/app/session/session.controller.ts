import { CurrentUser } from '@api/app/auth/current-user.decorator';
import { IsOrganizationUser } from '@api/app/organization/guard/organization-user.guard';
import { User } from '@api/app/user/user.entity';
import { Body, Controller, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common';
import { SessionService } from '@api/app/session/session.service';
import { OrganizationUserRole } from '@interfaces/organization';
import { CreateSessionDto, CreateSessionResponseDto } from '@interfaces/session';
import { CurrentOrg, OrganizationGuard } from '@api/app/organization/guard/organization.guard';
import { Organization } from '@api/app/organization/organization.entity';

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

  @Put(':sessionId/end')
  closeSession(@Param('sessionId') sessionId: string) {
    return this.sessionService.endSession(sessionId);
  }

  @Get('organization/:organizationId')
  @UseGuards(OrganizationGuard)
  getOrganizationSessions(@CurrentOrg() organization: Organization) {}

  @Get('my')
  @UseGuards(OrganizationGuard)
  getMySessions(@CurrentOrg() organization: Organization) {}

  @Get(':sessionId')
  @UseGuards(OrganizationGuard)
  getSession(@CurrentOrg() organization: Organization) {}
}
