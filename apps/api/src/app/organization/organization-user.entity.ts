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

export enum OrganizationUserRole {
  Owner = 'Owner',
  Admin = 'Admin',
  Member = 'Member',
}

@Entity('organization_users')
export class OrganizationUser extends BaseEntity {
  @PrimaryColumn()
  organizationId: string;

  @PrimaryColumn()
  userId: string;

  @ManyToOne(() => User, (user) => user.id, { cascade: true, eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Promise<User>;

  @ManyToOne(() => Organization, (organization) => organization.id, {
    cascade: true,
    eager: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organizationId' })
  organization: Promise<Organization>;

  @Column({ type: 'enum', enum: OrganizationUserRole })
  role: OrganizationUserRole;

  @CreateDateColumn()
  createdAt: Date;
}
