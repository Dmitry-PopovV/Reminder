import { Request, Response } from "express";

export function sendUserController(req: Request, res: Response, next: Function) {
    res.status(200).json(req.session.user);
}
