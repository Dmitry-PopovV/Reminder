import { Events } from "../entity/Events";
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
    emailEmail: string;
}

async function send(event: SendedEvent) {
    try {
        await sgMail.send({
            to: event.emailEmail,
            from: {
                email: 'noreply@reminder.dmitryapps.cc',
                name: "Reminder"
            },
            subject: event.title,
            text: event.message,
            html: event.message,
        });
    } catch (err: any) {
        logger.log({
            level: 'error',
            message: `Email (id: ${event.id}) sending failed. ${err.response ? err.response.body.errors : err}`
        });
        throw err;
    }
}

export default async function sendEventEmail() {
    const events: SendedEvent[] = await Events
        .query(`SELECT * FROM "events"
        WHERE date_trunc('minute', "events"."eventDate") = date_trunc('minute', transaction_timestamp())
        OR (
            date_trunc('minute', transaction_timestamp()) >= date_trunc('minute', "events"."time") AND
            CAST(date_trunc('minute', transaction_timestamp()) AS TIME) = CAST(date_trunc('minute', "events"."time") AS TIME) AND (
                doesPeriodMatch('day', "events"."dayPeriodicity", "events"."time", transaction_timestamp())
                OR (
                    doesPeriodMatch('week', "events"."dayOfWeekPeriodicity", "events"."time", transaction_timestamp()) AND
                    getDay(transaction_timestamp()) = getNumber("events"."dayOfWeekPeriodicity")
                ) OR (
                    doesPeriodMatch('month', "events"."monthPeriodicity", "events"."time", transaction_timestamp()) AND
                    (
                        (
                            isNumber("events"."dayPeriodicity") AND
                            getDate(transaction_timestamp()) = CAST("events"."dayPeriodicity" AS integer)
                        ) OR
                        (
                            isNumber("events"."dayOfWeekPeriodicity") AND
                            isDayOfWeekThisDay(transaction_timestamp(), "events"."dayOfWeekPeriodicity", "events"."weekDayNumber")
                        )
                    )
                ) OR (
                    doesPeriodMatch('year', "events"."yearPeriodicity", "events"."time", transaction_timestamp()) AND
                    (
                        isNumber("events"."dayPeriodicity") AND
                        isNumber("events"."monthPeriodicity") AND
                        getDate(transaction_timestamp()) = CAST("events"."dayPeriodicity" AS integer) AND
                        getMonth(transaction_timestamp()) = CAST("events"."monthPeriodicity" AS integer) + 1
                    )
                )
            )
        )
        `);

    if (events.length !== 0) {
        const promises: Promise<void>[] = [];
        events.forEach((event) => { promises.push(send(event)) });
        try {
            await Promise.all(promises);
            console.log("Emails sended: ", events.length);
        } catch (err: any) {
            console.log("There is error during email sending: ", err.message);
        }
    } else {
        console.log("No emails");
    }
}
