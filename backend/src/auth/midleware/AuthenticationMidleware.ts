import { Request, Response } from "express";

export function AuthenticationMidleware(req: Request, res: Response, next: Function) {
    if (req.session.user === undefined) {
        res.sendStatus(401);
    } else {
        next();
    }
};
