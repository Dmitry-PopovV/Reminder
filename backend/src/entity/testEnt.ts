import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number|null

    @Column()
    name: string

    constructor(name: string) {
        this.id = null;
        this.name = name;
      }
}