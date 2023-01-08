import { CurrentUser } from '@api/app/auth/current-user.decorator';
import { AddMembersDto, ChangeUserRolesDto, CreateOrganizationDto } from '@interfaces/organization';
import { OrganizationUserRole } from '@api/app/organization/organization-user.entity';
import { IsOrganizationUser } from '@api/app/organization/guard/organization-user.guard';
import { Organization } from '@api/app/organization/organization.entity';
import { CurrentOrg, OrganizationGuard } from '@api/app/organization/guard/organization.guard';
import { OrganizationService } from '@api/app/organization/organization.service';
import { User } from '@api/app/user/user.entity';
import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';

@Controller('organization')
export class OrganizationController {
  @Inject()
  private readonly organizationService: OrganizationService;

  @Post()
  createOrganization(
    @CurrentUser() user: User,
    @Body() createOrganizationDto: CreateOrganizationDto
  ) {
    return this.organizationService.createOrganization(user, createOrganizationDto);
  }

  @Get()
  getMyOrganizations(@CurrentUser() user: User) {
    return this.organizationService.getMyOrganizations(user);
  }

  @Get(':id')
  @UseGuards(OrganizationGuard)
  getOrganization(@CurrentOrg() organization: Organization) {
    return organization;
  }

  @Post(':id/add-members')
  @UseGuards(OrganizationGuard)
  @IsOrganizationUser(OrganizationUserRole.Admin, OrganizationUserRole.Owner)
  addMember(@CurrentOrg() organization: Organization, @Body() addMembersDto: AddMembersDto) {
    return this.organizationService.addMembers(organization, addMembersDto);
  }

  @Post(':id/change-roles')
  @UseGuards(OrganizationGuard)
  @IsOrganizationUser(OrganizationUserRole.Owner)
  changeUserRoles(
    @CurrentOrg() organization: Organization,
    @Body() changeUserRolesDto: ChangeUserRolesDto
  ) {
    return this.organizationService.changeUserRoles(organization, changeUserRolesDto);
  }
}
