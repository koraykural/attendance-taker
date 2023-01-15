import { User } from '@api/app/user/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { pick } from 'lodash';
import { SearchUserParams, SearchUserResponse } from '@interfaces/user';
import { Brackets, ILike, In, Not, Repository } from 'typeorm';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async searchUsers(params: SearchUserParams): Promise<SearchUserResponse[]> {
    const { search, excludeOrgId } = params;
    let qb = this.userRepository
      .createQueryBuilder('user')
      .select(['"id"', '"firstName"', '"lastName"', '"email"'])
      .groupBy('id');

    if (search) {
      qb = qb.andWhere([
        { email: ILike(`%${search}%`) },
        { firstName: ILike(`%${search}%`) },
        { lastName: ILike(`%${search}%`) },
      ]);
    }

    if (excludeOrgId) {
      qb = qb
        .leftJoin(
          'user.organizations',
          'organization_user',
          `organization_user."userId" = user.id AND organization_user."organizationId" = :excludeOrgId`,
          { excludeOrgId }
        )
        .addSelect('organization_user.organizationId', 'organizationId')
        .andWhere(
          new Brackets((qb) =>
            qb
              .where(`"organizationId" != :excludeOrgId`, { excludeOrgId })
              .orWhere(`"organizationId" IS NULL`)
          )
        )
        .addGroupBy('"organizationId"');
    }

    const usersRaw = await qb.getRawMany();
    return usersRaw.map((user) => pick(user, ['id', 'email', 'firstName', 'lastName']));
  }
}
