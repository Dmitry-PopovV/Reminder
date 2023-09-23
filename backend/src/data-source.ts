import { DataSource } from "typeorm";
import { config } from "dotenv";
import { User } from "./entity/testEnt";
config({ path: 'src/env/.env' });

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: Number(process.env.port),
    username: process.env.User_Name,
    password: process.env.password,
    database: process.env.database,
    synchronize: true,
    logging: true,
    entities: [User],
    subscribers: [],
    migrations: [],
})