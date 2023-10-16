import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, PrimaryColumn } from "typeorm"

@Entity()
export class User extends BaseEntity {
    @PrimaryColumn()
    email: string

    @Column()
    fullName: string

    static insertIfNotExist(user: User) {
        return this.createQueryBuilder()
        .insert()
        .into(User)
        .values(user)
        .orIgnore()
        .execute();
    }

}
