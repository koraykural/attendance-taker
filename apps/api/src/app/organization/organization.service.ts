import { OrganizationUser } from '@api/app/organization/organization-user.entity';
import {
  CreateOrganizationDto,
  ChangeUserRolesDto,
  AddMembersDto,
  OrganizationUserRole,
  RoleOrderMap,
} from '@interfaces/organization';
import { OrganizationUserFactory } from '@api/app/organization/organization-user.factory';
import { Organization } from '@api/app/organization/organization.entity';
import { User } from '@api/app/user/user.entity';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { pick, sortBy, union } from 'lodash';

@Injectable()
export class OrganizationService {
  @Inject()
  private readonly organizationUserFactory: OrganizationUserFactory;
  @InjectRepository(Organization)
  private readonly organizationRepository: Repository<Organization>;
  @InjectRepository(OrganizationUser)
  private readonly organizationUserRepository: Repository<OrganizationUser>;

  async createOrganization(user: User, createOrganizationDto: CreateOrganizationDto) {
    await this.assertIsNotAnOrganizationOwner(user);
    await this.assertOrganizationNameIsUnique(createOrganizationDto.name);
    const organization = new Organization();
    Object.assign(organization, createOrganizationDto);
    await organization.save();
    const organizationUser = this.organizationUserFactory.createOwner(user.id, organization.id);
    await organizationUser.save();
    return pick(organization, ['id', 'name', 'createdAt']);
  }

  async getOrganization(organizationId: string) {
    return this.organizationRepository.findOne({ where: { id: organizationId } });
  }

  async getMyOrganizations(user: User) {
    const orgUsers = await this.organizationUserRepository.find({
      where: { userId: user.id },
      relations: ['organization'],
    });
    const list = await Promise.all(
      orgUsers.map(async (orgUser) => ({
        organization: await orgUser.organization,
        myRole: orgUser.role,
        joinedAt: orgUser.createdAt,
      }))
    );
    return sortBy(list, (org) => RoleOrderMap[org.myRole]);
  }

  async addMembers(organization: Organization, addMembersDto: AddMembersDto) {
    const { userIds } = addMembersDto;
    const orgUsers = userIds.map((userId) =>
      this.organizationUserFactory.createMember(userId, organization.id)
    );
    await this.organizationUserRepository
      .createQueryBuilder()
      .insert()
      .values(orgUsers)
      .orIgnore()
      .execute();
  }

  async changeUserRoles(organization: Organization, changeUserRolesDto: ChangeUserRolesDto) {
    this.assertThereAreNoDuplicates(changeUserRolesDto);
    const organizationId = organization.id;
    const { userIdsToAdmin, userIdsToMember, userIdsToRemove } = changeUserRolesDto;
    const promises: Promise<any>[] = [];
    if (userIdsToRemove) {
      promises.push(
        this.organizationUserRepository.delete({ organizationId, userId: In(userIdsToRemove) })
      );
    }
    if (userIdsToAdmin) {
      promises.push(
        this.organizationUserRepository.update(
          { organizationId, userId: In(userIdsToAdmin) },
          { role: OrganizationUserRole.Admin }
        )
      );
    }
    if (userIdsToMember) {
      promises.push(
        this.organizationUserRepository.update(
          { organizationId, userId: In(userIdsToMember) },
          { role: OrganizationUserRole.Member }
        )
      );
    }
    await Promise.all(promises);
  }

  private assertThereAreNoDuplicates(changeUserRolesDto: ChangeUserRolesDto) {
    const { userIdsToAdmin, userIdsToMember, userIdsToRemove } = changeUserRolesDto;
    if (
      union(userIdsToAdmin, userIdsToMember, userIdsToRemove).length !==
      (userIdsToAdmin?.length || 0) +
        (userIdsToMember?.length || 0) +
        (userIdsToRemove?.length || 0)
    ) {
      throw new BadRequestException('There are duplicates in the given lists.');
    }
  }

  private async assertIsNotAnOrganizationOwner(user: User) {
    const isAnOrganizationOwner = await this.organizationUserRepository.exist({
      where: { userId: user.id, role: OrganizationUserRole.Owner },
    });
    if (isAnOrganizationOwner) {
      throw new BadRequestException('You already own an organization.');
    }
  }

  private async assertOrganizationNameIsUnique(name: string) {
    const notUnique = await this.organizationRepository.exist({
      where: { name },
    });
    if (notUnique) {
      throw new BadRequestException('An organization with this name already exists.');
    }
  }
}
