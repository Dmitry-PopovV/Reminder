import { format, createLogger, transports } from "winston";

const myFormat = format.printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
    format: format.combine(
        format.label({ label: 'logger' }),
        format.timestamp(),
        myFormat
    ),
    transports: [
        new transports.Console()
    ]
});

export default logger;
