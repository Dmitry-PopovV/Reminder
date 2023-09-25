import { DataSource } from "typeorm";
import { config } from "dotenv";
import { User } from "./entity/testEnt";
config({ path: 'src/env/.env' });

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: Number(process.env.PORT),
    username: process.env.USER_NAME,
    password: process.env.PASWORD,
    database: process.env.DATABASE,
    synchronize: true,
    logging: true,
    entities: [User],
    subscribers: [],
    migrations: [],
});
