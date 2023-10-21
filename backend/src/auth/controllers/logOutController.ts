import { Request, Response } from "express";

export function logOutController(req: Request, res: Response) {
    req.session.user = undefined;

    res.sendStatus(200);
}
