import { Request, Response } from "express";

export async function UserController(req: Request, res: Response, next: Function) {
    res.status(200).json(req.session.user);
}
