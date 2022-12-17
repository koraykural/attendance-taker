import { OrganizationUser } from '@api/app/organization/organization-user.entity';
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('organizations')
export class Organization extends BaseEntity {
  @PrimaryColumn()
  id: string = `org-${uuid()}`;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => OrganizationUser, (ou) => ou.organization, { eager: false })
  users: Promise<OrganizationUser[]>;

  @CreateDateColumn()
  createdAt: Date;
}
