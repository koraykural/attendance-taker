import { OrganizationUser } from '@api/app/organization/organization-user.entity';
import { Session } from '@api/app/session/session.entity';
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

  @OneToMany(() => Session, (s) => s.organization, { eager: false })
  sessions: Promise<Session[]>;

  @CreateDateColumn()
  createdAt: Date;
}
