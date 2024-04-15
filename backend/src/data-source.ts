import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Event } from "./entity/Event";
import { config } from "dotenv";
import { Timestamps1712856833231 } from "./migrations/1712856833231-timestamps";

config({ path: 'src/env/.env' });

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASWORD,
    database: process.env.DATABASE,
    synchronize: false,
    logging: false,
    entities: [User, Event],
    subscribers: [],
    migrations: [Timestamps1712856833231],
    ssl: {
        rejectUnauthorized: false
    }
});
