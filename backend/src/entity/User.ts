import { Entity, BaseEntity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { Event } from "./Event";

@Entity()
export class User extends BaseEntity {
    @PrimaryColumn()
    email: string

    @Column()
    fullName: string

    @OneToMany(()=> Event, (event)=>event.user)
    events: Event[]

    static insertIfNotExist(user: User) {
        return this.createQueryBuilder()
        .insert()
        .into(User)
        .values(user)
        .orIgnore()
        .execute();
    }

}
