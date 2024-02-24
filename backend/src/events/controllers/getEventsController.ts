import { Request, Response } from "express";
import { findEvents } from "../services/findEvents";

export function getEventsController(req: Request, res: Response, next: Function) {
    if(!req.query.months) {
        next(new Error("wrong query at getEventsController"));
    } else {
        findEvents(req.query.months as string[], req.session.user!.email)
        .then((events) => {
            res.status(200).json(events);
        })
        .catch((err) => {
            next(err);
        });
    }
}
