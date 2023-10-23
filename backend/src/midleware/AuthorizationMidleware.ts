import { Request, Response } from "express";

export function AuthorizationMidleware(req: Request, res: Response, next: Function) {
    if (!req.session.user) {
        res.sendStatus(401);
    } else {
        next();
    }
};
