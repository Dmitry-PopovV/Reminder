import { Request, Response } from "express";

export async function sendUserController(req: Request, res: Response, next: Function) {
    res.status(200).json(req.session.user);
}
