import { Organization } from '@api/app/organization/organization.entity';
import { SessionAttendee } from '@api/app/session/session-attendee.entity';
import { User } from '@api/app/user/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('sessions')
export class Session extends BaseEntity {
  @PrimaryColumn()
  id: string = `session-${uuid()}`;

  @Column({ nullable: false })
  organizationId: string;

  @ManyToOne(() => Organization, (o) => o.id, { eager: false, cascade: true, onDelete: 'CASCADE' })
  organization: Promise<Organization>;

  @Column({ nullable: false })
  createdById: string;

  @ManyToOne(() => User, (u) => u.id, { eager: false, onDelete: 'CASCADE' })
  createdBy: Promise<User>;

  @Column({ nullable: false })
  name: string;

  @OneToMany(() => SessionAttendee, (sa) => sa.session, { eager: false })
  attendees: Promise<SessionAttendee[]>;

  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamp', { nullable: true })
  endedAt: Date | null;

  async terminateSession() {
    this.endedAt = new Date();
    await this.save();
  }

  async reopenSession() {
    this.endedAt = null;
    await this.save();
  }
}
