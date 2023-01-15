import { CurrentUser } from '@api/app/auth/current-user.decorator';
import {
  AddMembersDto,
  ChangeUserRolesDto,
  CreateOrganizationDto,
  OrganizationDetailsResponse,
  OrganizationUserRole,
  RoleOrderMap,
} from '@interfaces/organization';
import { IsOrganizationUser } from '@api/app/organization/guard/organization-user.guard';
import { Organization } from '@api/app/organization/organization.entity';
import { CurrentOrg, OrganizationGuard } from '@api/app/organization/guard/organization.guard';
import { OrganizationService } from '@api/app/organization/organization.service';
import { User } from '@api/app/user/user.entity';
import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { pick, sortBy } from 'lodash';
import { OrganizationUser } from '@api/app/organization/organization-user.entity';

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
  @IsOrganizationUser()
  async getOrganization(
    @CurrentUser() user: User,
    @CurrentOrg() organization: Organization
  ): Promise<OrganizationDetailsResponse> {
    const orgUsers = await organization.users;
    const currentOrganizationUser = orgUsers.find(
      (orgUser) => orgUser.userId === user.id
    ) as OrganizationUser;
    const users = await Promise.all(
      orgUsers.map(async (orgUser) => {
        const user = await orgUser.user;
        return {
          id: user.id,
          email: user.email,
          fullName: `${user.firstName} ${user.lastName}`,
          joinedAt: orgUser.createdAt,
          role: orgUser.role,
        };
      })
    );
    return {
      ...pick(organization, ['id', 'name', 'createdAt']),
      myRole: currentOrganizationUser.role,
      users: sortBy(users, (user) => RoleOrderMap[user.role]),
    };
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
