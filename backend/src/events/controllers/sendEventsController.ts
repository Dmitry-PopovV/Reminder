import { Request, Response } from "express";
import { findEvents } from "../services/findEvents";

export function sendEventsController(req: Request, res: Response, next: Function) {
    findEvents(req.body.months)
        .then((events) => {
            res.status(200).json(events);
        })
        .catch((err) => {
            next(err);
        })
}
