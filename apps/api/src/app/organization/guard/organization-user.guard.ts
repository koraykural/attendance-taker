import { OrganizationUser } from '@api/app/organization/organization-user.entity';
import { OrganizationUserRole } from '@interfaces/organization';
import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  mixin,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

const OrganizationUserGuard = (roles: OrganizationUserRole[]) => {
  class OrganizationUserGuard implements CanActivate {
    @InjectRepository(OrganizationUser)
    private readonly organizationUserRepository: Repository<OrganizationUser>;

    canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest();
      const userId = req.user.id;
      if (!userId) throw new UnauthorizedException();
      const organizationId =
        req.param.organizationId || req.body.organizationId || req.query.organizationId;
      return this.organizationUserRepository.exist({
        where: { userId, organizationId, role: In(roles) },
      });
    }
  }

  return mixin(OrganizationUserGuard);
};

/** Validates if user is a member of the organization. If no role is given, check for any role. */
export function IsOrganizationUser(...roles: OrganizationUserRole[]) {
  if (roles.length === 0) {
    roles = Object.values(OrganizationUserRole);
  }
  return applyDecorators(UseGuards(OrganizationUserGuard(roles)));
}
