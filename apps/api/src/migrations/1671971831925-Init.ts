import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1671971831925 implements MigrationInterface {
  name = 'Init1671971831925';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "organizations" ("id" character varying NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9b7ca6d30b94fef571cff876884" UNIQUE ("name"), CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."organization_users_role_enum" AS ENUM('Owner', 'Admin', 'Member')`
    );
    await queryRunner.query(
      `CREATE TABLE "organization_users" ("organizationId" character varying NOT NULL, "userId" character varying NOT NULL, "role" "public"."organization_users_role_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0e9e34aea82db89810e601efafe" PRIMARY KEY ("organizationId", "userId"))`
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" character varying NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "session_attandees" ("sessionId" character varying NOT NULL, "userId" character varying NOT NULL, "attandedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_841b2c90351ba011fdc81fc97fe" PRIMARY KEY ("sessionId", "userId"))`
    );
    await queryRunner.query(
      `CREATE TABLE "sessions" ("id" character varying NOT NULL, "organizationId" character varying NOT NULL, "createdById" character varying NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "endedAt" TIMESTAMP, CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "organization_users" ADD CONSTRAINT "FK_c4a44a1be146c6c6197f82725d8" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "organization_users" ADD CONSTRAINT "FK_26f83117dea41b00841385b9821" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "session_attandees" ADD CONSTRAINT "FK_8144e6c7c54c8460fd6de15e510" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "session_attandees" ADD CONSTRAINT "FK_701b326200475de4660038a8d40" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "FK_43b66852f17e596cbc65764b3b1" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "FK_d26fe2e6102cd9c47650a0d7a6f" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sessions" DROP CONSTRAINT "FK_d26fe2e6102cd9c47650a0d7a6f"`
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" DROP CONSTRAINT "FK_43b66852f17e596cbc65764b3b1"`
    );
    await queryRunner.query(
      `ALTER TABLE "session_attandees" DROP CONSTRAINT "FK_701b326200475de4660038a8d40"`
    );
    await queryRunner.query(
      `ALTER TABLE "session_attandees" DROP CONSTRAINT "FK_8144e6c7c54c8460fd6de15e510"`
    );
    await queryRunner.query(
      `ALTER TABLE "organization_users" DROP CONSTRAINT "FK_26f83117dea41b00841385b9821"`
    );
    await queryRunner.query(
      `ALTER TABLE "organization_users" DROP CONSTRAINT "FK_c4a44a1be146c6c6197f82725d8"`
    );
    await queryRunner.query(`DROP TABLE "sessions"`);
    await queryRunner.query(`DROP TABLE "session_attandees"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "organization_users"`);
    await queryRunner.query(`DROP TYPE "public"."organization_users_role_enum"`);
    await queryRunner.query(`DROP TABLE "organizations"`);
  }
}
