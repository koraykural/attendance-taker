import { Organization } from '@api/app/organization/organization.entity';
import { User } from '@api/app/user/user.entity';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('sessions')
export class Session extends BaseEntity {
  @PrimaryColumn()
  id: string = `session-${uuid()}`;

  @ManyToOne(() => Organization, (o) => o.id, { eager: false, cascade: true })
  organization: Promise<Organization>;

  @ManyToOne(() => User, (u) => u.id, { eager: false })
  createdBy: Promise<User>;

  @CreateDateColumn()
  createdAt: Date;

  @Column('datetime')
  endedAt: Date | null;
}
