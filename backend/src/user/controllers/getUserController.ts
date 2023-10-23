import { Request, Response } from "express";

export async function getUserController(req: Request, res: Response, next: Function) {
    res.status(200).json(req.session.user);
}
