import "reflect-metadata";
import "./types/session";
import express from 'express';
import serverInitialize from "./serverInitialize";
import ErrorMidleware from "./midleware/ErrorMidleware";
import Routers from "./routers/Routers";
import { SetSessionMidleware } from "./midleware/SetSessionMidleware";
import { config } from "dotenv";

config({ path: 'src/env/.env' });

const app = express();
const port = Number(process.env.PORT);

async function main() {
    try {
        const emailSendingJob = await serverInitialize();

        app
            .use(express.json())
            .use(SetSessionMidleware())
            .use(express.static(__dirname + "/static"))
            .use("/api", Routers)
            .use(ErrorMidleware);

        const server = app
            .listen(port, () => {
                console.log(`App listening on port ${port}`);
            });

        return { server, emailSendingJob };
    } catch (err) {
        console.log("Fatal error:\n", err);
    }
}
export const proceses = main();
