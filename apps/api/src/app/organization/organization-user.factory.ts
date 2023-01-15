import { OrganizationUser } from '@api/app/organization/organization-user.entity';
import { OrganizationUserRole } from '@interfaces/organization';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrganizationUserFactory {
  private createUser(
    userId: string,
    organizationId: string,
    role: OrganizationUserRole
  ): OrganizationUser {
    const orgUser = new OrganizationUser();
    return Object.assign(orgUser, {
      userId,
      organizationId,
      role,
    });
  }

  createOwner(userId: string, organizationId: string): OrganizationUser {
    return this.createUser(userId, organizationId, OrganizationUserRole.Owner);
  }

  createMember(userId: string, organizationId: string): OrganizationUser {
    return this.createUser(userId, organizationId, OrganizationUserRole.Member);
  }
}
