import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Event extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @ManyToOne(()=> User, (user)=>user.events)
    user: User

    @Column()
    title: string

    @Column()
    message: string

    @Column({ nullable: true, type: "timestamp with time zone" })
    eventDate: Date | null

    @Column({ nullable: true, type: "timestamp with time zone" })
    time: Date | null

    @Column({ nullable: true, type: "character varying" })
    dayPeriodicity: string | null

    @Column({ nullable: true, type: "character varying" })
    monthPeriodicity: string | null

    @Column({ nullable: true, type: "character varying" })
    yearPeriodicity: string | null

    @Column({ nullable: true, type: "character varying" })
    dayOfWeekPeriodicity: string | null
    
    @Column({ nullable: true, type: "integer" })
    weekDayNumber: number | null

    @CreateDateColumn({ default: () => 'NOW()' })
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
