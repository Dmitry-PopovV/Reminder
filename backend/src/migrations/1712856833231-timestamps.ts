import { MigrationInterface, QueryRunner } from "typeorm"

export class Timestamps1712856833231 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "event" ADD "createdAt" timestamp NOT NULL DEFAULT NOW(), ADD "updatedAt" timestamp`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "event" DROP COLUMN "createdAt", DROP COLUMN "updatedAt"`
        );
    }

}
