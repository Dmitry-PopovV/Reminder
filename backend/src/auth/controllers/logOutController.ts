import { Request, Response } from "express";

export function logoutController(req: Request, res: Response) {
    req.session.user = null;

    res.sendStatus(200);
}
