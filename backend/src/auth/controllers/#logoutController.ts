import { Request, Response } from "express";

export function logoutController(req: Request, res: Response) {
    req.session.destroy((err) => { if(err) console.log(err) });

    res.sendStatus(200);
}
