import { OrganizationService } from '@api/app/organization/organization.service';
import {
  CanActivate,
  ExecutionContext,
  NotFoundException,
  createParamDecorator,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';

export class OrganizationGuard implements CanActivate {
  @Inject()
  private readonly organizationService: OrganizationService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const organizationId =
      req.params.organizationId ||
      req.body.organizationId ||
      req.query.organizationId ||
      req.params.id ||
      req.body.id ||
      req.query.id;
    if (!organizationId) throw new NotFoundException();
    const organization = await this.organizationService.getOrganization(organizationId);
    if (!organization) throw new NotFoundException();
    req.organization = organization;
    return true;
  }
}

export const CurrentOrg = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  if (!request.organization)
    throw new InternalServerErrorException('Should use CurrentOrg with OrganizationGuard');
  return request.organization;
});
