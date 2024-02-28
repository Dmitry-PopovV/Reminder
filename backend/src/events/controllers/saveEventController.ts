import { Request, Response } from "express";
import { saveEvent } from "../services/saveEvent";

export function saveEventController(req: Request, res: Response, next: Function) {
    saveEvent(req.body, req.session.user!.email)
        .then((id) => {
            res.status(200).send(id);
        })
        .catch((err) => {
            next(err);
        });
}
