import { Request, Response } from "express";

export function logoutController(req: Request, res: Response, next: Function) {
    try {
        req.session.destroy(()=>{ });
    } catch(err) {
        next(err);
    }
    
    res.sendStatus(200);
}
