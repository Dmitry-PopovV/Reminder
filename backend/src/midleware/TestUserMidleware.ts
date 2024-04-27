import { Request, Response, NextFunction } from "express";
import { config } from "dotenv";

config({ path: 'src/env/.env' });

export default function TestUserMidleware(req: Request, res: Response, next: NextFunction) {
    if (process.env.NODE_ENV === "test") {
        req.session.user = { email: "test@email.com", fullName: "Test User" };
    }
    next();
}
