import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { DataSource } from 'typeorm';
import { User } from '@api/app/user/user.entity';
import { Organization } from '@api/app/organization/organization.entity';
import { OrganizationUser } from '@api/app/organization/organization-user.entity';
import { Session } from '@api/app/session/session.entity';
import { SessionAttendee } from '@api/app/session/session-attendee.entity';
import { join } from 'path';
import { Config } from './config';

const entities = [User, Organization, OrganizationUser, Session, SessionAttendee];

const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: Config.DB_HOST,
  port: Config.DB_PORT,
  username: Config.DB_USERNAME,
  database: Config.DB_DATABASE,
  password: Config.DB_PASSWORD,
  entities,
  migrations: [join(__dirname, '..', 'migrations', '*.ts')],
  logging: false,
  synchronize: false,
  metadataTableName: 'typeorm_metadata',
  migrationsTableName: 'typeorm_migrations',
  ...(Config.isProduction && {
    ssl: {
      rejectUnauthorized: false,
    },
  }),
};

export default new DataSource(config);
