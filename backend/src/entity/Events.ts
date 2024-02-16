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

    @Column({ nullable: true, type: "timestamp with time zone" })
    eventDate: Date

    @Column({ nullable: true, type: "timestamp with time zone" })
    time: Date

    @Column({ nullable: true })
    dayPeriodicity: string

    @Column({ nullable: true })
    monthPeriodicity: string

    @Column({ nullable: true })
    yearPeriodicity: string

    @Column({ nullable: true })
    dayOfWeekPeriodicity: string
    
    @Column({ nullable: true })
    weekDayNumber: number
}
