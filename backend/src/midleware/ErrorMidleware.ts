import { Request, Response, NextFunction } from "express";
import logger from "../logger";

export default function ErrorMidleware(err: Error, req: Request, res: Response, next: NextFunction) {
    logger.log({
        level: 'error',
        message: err.message
    });
    if (res.headersSent) {
        return next(err);
    }
    res.sendStatus(500);
}
