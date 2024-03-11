import { Events } from "../entity/Events";

export default async function sendEventEmail() {
    const events: Events[] = await Events
        .query(`SELECT * FROM "events"
        WHERE date_trunc('minute', "events"."eventDate") = date_trunc('minute', transaction_timestamp())
        OR (
            date_trunc('minute', transaction_timestamp()) >= date_trunc('minute', "events"."time") AND (
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
        `)
    console.log("Emails sended:", events);
}