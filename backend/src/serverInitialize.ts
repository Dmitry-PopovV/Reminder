import { AppDataSource } from "./data-source";
import { config } from "dotenv";
import createDBFunctions from "./services/createDBFunctions";
import startEmailSendingJob from "./services/startEmailSendingJob";

config({ path: 'src/env/.env' });

export default async function serverInitialize() {
    try {
        await AppDataSource.initialize();
        await createDBFunctions();
        startEmailSendingJob();
        const cookieSecret = process.env.COOKIE_SECRET;
        if (cookieSecret === undefined) {
            throw new Error("cookieSecret is not set");
        }

        return { cookieSecret };
    } catch (err) {
        console.log("Server initializing error:\n", (err as Error).message);
        throw err;
    }
}
