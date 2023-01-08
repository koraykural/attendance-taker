import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { DataSource } from 'typeorm';
import { User } from '@api/app/user/user.entity';
import { Organization } from '@api/app/organization/organization.entity';
import { OrganizationUser } from '@api/app/organization/organization-user.entity';
import { Session } from '@api/app/session/session.entity';
import { SessionAttandee } from '@api/app/session/session-attandee.entity';
import { join } from 'path';

const entities = [User, Organization, OrganizationUser, Session, SessionAttandee];

const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'koray',
  database: 'attandance',
  password: 'DhdtG53euTkC9hfP',
  entities,
  migrations: [join(__dirname, '..', 'migrations', '*.ts')],
  logging: false,
  synchronize: false,
  metadataTableName: 'typeorm_metadata',
  migrationsTableName: 'typeorm_migrations',
};

export default new DataSource(config);
