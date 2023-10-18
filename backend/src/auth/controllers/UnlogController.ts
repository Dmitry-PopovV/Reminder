import { Request, Response } from "express";

export function UnlogController(req: Request, res: Response) {
    req.session.user = undefined;

    res.sendStatus(200);
}
