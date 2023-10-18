import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { config } from "dotenv";
config({ path: 'src/env/.env' });

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: Number(process.env.PORT),
    username: process.env.USER_NAME,
    password: process.env.PASWORD,
    database: process.env.DATABASE,
    synchronize: true,
    logging: false,
    entities: [User],
    subscribers: [],
    migrations: [],
});
