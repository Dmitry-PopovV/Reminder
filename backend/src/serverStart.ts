import { AppDataSource } from "./data-source";

export default async function serverStart() {
    try {
        await AppDataSource.initialize();
    } catch (err) {
        console.log("Server start error:\n", (err as Error).message);
        throw err;
    }
}
