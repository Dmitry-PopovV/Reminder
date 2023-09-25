import { Request, Response, NextFunction } from "express";
import winston from "winston";

const myFormat = winston.format.printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.label({ label: 'logger' }),
        winston.format.timestamp(),
        myFormat
    ),
    transports: [
        new winston.transports.Console()
    ]
});

export default function ErrorMidleware(err: Error, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
        return next(err);
    }
    logger.log({
        level: 'error',
        message: 'Something broke!'
    });
    res.status(500).send('500: Something broke!');
}
