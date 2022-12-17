import { Session } from '@api/app/session/session.entity';
import { User } from '@api/app/user/user.entity';
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('session_attandees')
export class SessionAttandee extends BaseEntity {
  @PrimaryColumn()
  sessionId: string;

  @PrimaryColumn()
  userId: string;

  @ManyToOne(() => User, (user) => user.id, { cascade: true, eager: true })
  @JoinColumn({ name: 'userId' })
  user: Promise<User>;

  @ManyToOne(() => Session, (session) => session.id, { cascade: true, eager: true })
  @JoinColumn({ name: 'sessionId' })
  session: Promise<Session>;

  @CreateDateColumn()
  attandedAt: Date;
}
