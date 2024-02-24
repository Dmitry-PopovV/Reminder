import { Request, Response } from "express";
import { deleteEvent } from "../services/deleteEvent";

export function deleteEventController(req: Request, res: Response, next: Function) {
    deleteEvent(req.body.id, req.session.user!.email)
        .then(() => {
            res.sendStatus(200);
        })
        .catch((err) => {
            next(err);
        });
}
