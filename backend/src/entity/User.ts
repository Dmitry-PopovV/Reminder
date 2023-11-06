import { Entity, BaseEntity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { Events } from "./Events";

@Entity()
export class User extends BaseEntity {
    @PrimaryColumn()
    email: string

    @Column()
    fullName: string

    @OneToMany(()=> Events, (events)=>events.email)
    events: Events[]

    static insertIfNotExist(user: User) {
        return this.createQueryBuilder()
        .insert()
        .into(User)
        .values(user)
        .orIgnore()
        .execute();
    }

}
