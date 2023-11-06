import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Events extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @ManyToOne(()=> User, (user)=>user.events)
    email: User

    @Column()
    title: string

    @Column()
    message: string

    @Column({ nullable: true })
    sendingDate: Date

    @Column({ nullable: true })
    hourPeriodicity: string

    @Column({ nullable: true })
    dayPeriodicity: string

    @Column({ nullable: true })
    weekPeriodicity: string

    @Column({ nullable: true })
    monthPeriodicity: string

    @Column({ nullable: true })
    yearPeriodicity: string
}
