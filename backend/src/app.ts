import "reflect-metadata";
import "./types/session";
import express from 'express';
import session from 'express-session';
import serverInitialize from "./serverInitialize";
import ErrorMidleware from "./midleware/ErrorMidleware";
import Routers from "./routers/Routers";


const app = express();
const port = 3000;
const cookieTime = 24 * 60 * 60 * 1000;

async function main() {
    try {
        const { cookieSecret } = await serverInitialize();

        app
            .use(express.json())
            .use(session({ secret: cookieSecret, cookie: { maxAge: cookieTime, httpOnly: true }, resave: false, saveUninitialized: true }))
            .use((req, res, next)=>{if(!req.session.user) {req.session.user = {email: 'Dmitry.Popov.2002@gmail.com', fullName: 'Dmitry Popov'}}; next()})
            .use("/api", Routers)
            .use(ErrorMidleware);
        app
            .listen(port, () => {
                console.log(`Example app listening on port ${port}`);
            });
    } catch (err) {
        console.log("Fatal error:\n", err);
    }
}
main();
