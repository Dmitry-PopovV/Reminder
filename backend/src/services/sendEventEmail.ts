import { Event } from "../entity/Event";
import sgMail from "@sendgrid/mail";
import logger from "../logger";

if (!process.env.SENDGRID_API_KEY) {
    throw new Error("SENDGRID_API_KEY is not available");
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

type SendedEvent = {
    id: string;
    title: string;
    message: string;
    userEmail: string;
}

type RightResponseError = Omit<sgMail.ResponseError, "response"> & {
    response: {
        headers: { [key: string]: string }
        body: { errors: string[] }
    }
}

async function send(event: SendedEvent) {
    try {
        await sgMail.send({
            to: event.userEmail,
            from: {
                email: 'noreply@reminder.dmitryapps.cc',
                name: "Reminder"
            },
            subject: event.title,
            text: event.message,
            html: event.message,
        });
    } catch (err) {
        logger.log({
            level: 'error',
            message: `Email (id: ${event.id}) sending failed. ${(err as RightResponseError).response ? (err as RightResponseError).response.body.errors : err}`
        });
        throw err;
    }
}

export default async function sendEventEmail() {
    const events: SendedEvent[] = await Event
        .query(`SELECT * FROM "event"
        WHERE date_trunc('minute', "event"."eventDate") = date_trunc('minute', transaction_timestamp())
        OR (
            date_trunc('minute', transaction_timestamp()) >= date_trunc('minute', "event"."time") AND
            CAST(date_trunc('minute', transaction_timestamp()) AS TIME) = CAST(date_trunc('minute', "event"."time") AS TIME) AND (
                doesPeriodMatch('day', "event"."dayPeriodicity", "event"."time", transaction_timestamp())
                OR (
                    doesPeriodMatch('week', "event"."dayOfWeekPeriodicity", "event"."time", transaction_timestamp()) AND
                    getDay(transaction_timestamp()) = getNumber("event"."dayOfWeekPeriodicity")
                ) OR (
                    doesPeriodMatch('month', "event"."monthPeriodicity", "event"."time", transaction_timestamp()) AND
                    (
                        (
                            isNumber("event"."dayPeriodicity") AND
                            getDate(transaction_timestamp()) = CAST("event"."dayPeriodicity" AS integer)
                        ) OR
                        (
                            isNumber("event"."dayOfWeekPeriodicity") AND
                            isDayOfWeekThisDay(transaction_timestamp(), "event"."dayOfWeekPeriodicity", "event"."weekDayNumber")
                        )
                    )
                ) OR (
                    doesPeriodMatch('year', "event"."yearPeriodicity", "event"."time", transaction_timestamp()) AND
                    (
                        isNumber("event"."dayPeriodicity") AND
                        isNumber("event"."monthPeriodicity") AND
                        getDate(transaction_timestamp()) = CAST("event"."dayPeriodicity" AS integer) AND
                        getMonth(transaction_timestamp()) = CAST("event"."monthPeriodicity" AS integer) + 1
                    )
                )
            )
        )
        `);

    if (events.length !== 0) {
        const sendingsEvents: Promise<void>[] = [];
        events.forEach((event) => { sendingsEvents.push(send(event)) });
        try {
            await Promise.all(sendingsEvents);
        } catch (err) {
            console.log("There is error during email sending: ", (err as Error).message);
        }
    }
}
