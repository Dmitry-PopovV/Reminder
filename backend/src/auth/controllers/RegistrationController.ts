import { Request, Response } from "express";
import { Registration } from "../services/Registration";

export async function RegistrationController(req: Request, res: Response, next: Function) {
    try{
        const user = await Registration(req.body.code);
        req.session.user = user;
        res.status(201).json(user);
    } catch(err) {
        next(err);
    }
}
