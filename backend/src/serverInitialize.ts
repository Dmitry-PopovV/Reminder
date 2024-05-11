import { AppDataSource } from "./data-source";
import createDBFunctions from "./services/createDBFunctions";
import startEmailSendingJob from "./services/startEmailSendingJob";

export default async function serverInitialize() {
    try {
        await AppDataSource.initialize();
        await createDBFunctions();
        return startEmailSendingJob();
    } catch (err) {
        console.log("Server initializing error:\n", (err as Error).message);
        throw err;
    }
}
