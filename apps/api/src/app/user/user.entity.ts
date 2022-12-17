import { OrganizationUser } from '@api/app/organization/organization-user.entity';
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryColumn()
  id: string = `user-${uuid()}`;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToMany(() => OrganizationUser, (ou) => ou.user, { eager: false })
  organizations: Promise<OrganizationUser[]>;

  @CreateDateColumn()
  createdAt: Date;
}
