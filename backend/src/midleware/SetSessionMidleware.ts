import session from 'express-session';
import { config } from "dotenv";

config({ path: 'src/env/.env' });

const cookieTime = 24 * 60 * 60 * 1000;
const cookieSecret = process.env.COOKIE_SECRET as string;

export function SetSessionMidleware() {
    return session({
        secret: cookieSecret,
        cookie: {
            maxAge: cookieTime,
            httpOnly: true
        },
        resave: false,
        saveUninitialized: true
    })
}
