import { OrganizationUser } from '@api/app/organization/organization-user.entity';
import { OrganizationUserFactory } from '@api/app/organization/organization-user.factory';
import { OrganizationController } from '@api/app/organization/organization.controller';
import { Organization } from '@api/app/organization/organization.entity';
import { OrganizationService } from '@api/app/organization/organization.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, OrganizationUser])],
  controllers: [OrganizationController],
  providers: [OrganizationService, OrganizationUserFactory],
  exports: [OrganizationService],
})
export class OrganizationModule {}
