import "reflect-metadata";
import "./types/session";
import express from 'express';
import session from 'express-session';
import serverInitialize from "./serverInitialize";
import ErrorMidleware from "./midleware/ErrorMidleware";
import Routers from "./routers/Routers";
import { config } from "dotenv";

config({ path: 'src/env/.env' });

const app = express();
const port = Number(process.env.PORT);
const cookieTime = 24 * 60 * 60 * 1000;

async function main() {
    try {
        const { cookieSecret } = await serverInitialize();

        app
            .use(express.json())
            .use(session({ secret: cookieSecret, cookie: { maxAge: cookieTime, httpOnly: true }, resave: false, saveUninitialized: true }))
            .use(express.static(__dirname + "/static"))
            .use("/api", Routers)
            .use(ErrorMidleware);
        app
            .listen(port, () => {
                console.log(`App listening on port ${port}`);
            });
    } catch (err) {
        console.log("Fatal error:\n", err);
    }
}
main();
