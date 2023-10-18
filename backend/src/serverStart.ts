import { AppDataSource } from "./data-source";
import { config } from "dotenv";
config({ path: 'src/env/.env' });

export default async function serverStart() {
    try {
        await AppDataSource.initialize();
        const cookieSecret = process.env.COOKIE_SECRET;
        if(cookieSecret === undefined) {
            throw new Error("cookieSecret is not set");
        }

        return cookieSecret;
    } catch (err) {
        console.log("Server start error:\n", (err as Error).message);
        throw err;
    }
}
