import { OrganizationUserRole } from '@api/app/organization/organization-user-role.enum';
import { Organization } from '@api/app/organization/organization.entity';
import { User } from '@api/app/user/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('organization_users')
export class OrganizationUser extends BaseEntity {
  @PrimaryColumn()
  organizationId: string;

  @PrimaryColumn()
  userId: string;

  @ManyToOne(() => User, (user) => user.id, { cascade: true, eager: true })
  @JoinColumn({ name: 'userId' })
  user: Promise<User>;

  @ManyToOne(() => Organization, (organization) => organization.id, { cascade: true, eager: true })
  @JoinColumn({ name: 'organizationId' })
  organization: Promise<Organization>;

  @Column({ enum: OrganizationUserRole })
  role: OrganizationUserRole;

  @CreateDateColumn()
  createdAt: Date;
}
