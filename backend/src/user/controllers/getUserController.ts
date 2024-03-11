import { Request, Response } from "express";

export function getUserController(req: Request, res: Response, next: Function) {
    res.status(200).json(req.session.user);
}
