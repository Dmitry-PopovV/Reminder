import { Events } from "../../entity/Events";

type returnedEvents = {
    oneTimeEvents: {
        id: string
        title: string
        message: string
        time: string
    }[],
    repetitiveEvents: {
        id: string
        title: string
        message: string
        time: string
        dayPeriodicity: string
        monthPeriodicity: string
        yearPeriodicity: string
        dayOfWeekPeriodicity: string
        weekDayNumber: number
    }[]
}

export async function findEvents(months: string[]) {
    const searchStart = new Date(months[0]);
    const searchEnd = new Date(months[1]);
    const events: Events[] = await Events
        .query(
            `SELECT * FROM "events" WHERE "events"."eventDate" BETWEEN $1 AND $2
                OR "events"."monthPeriodicity" = '*'
                OR (POSITION('/' IN "events"."monthPeriodicity") != 0 AND
                CASE
                WHEN getMonth($1) < getMonth($2) THEN
                getMonth($1)
                - MOD(getMonth($1), getMonthPeriodicity("events"."monthPeriodicity")) 
			    + getMonthPeriodicity("events"."monthPeriodicity") BETWEEN getMonth($1) AND getMonth($2)
                WHEN getMonth($1) >= getMonth($2) THEN
                getMonth($1)
                - MOD(getMonth($1), getMonthPeriodicity("events"."monthPeriodicity")) 
			    + getMonthPeriodicity("events"."monthPeriodicity") BETWEEN getMonth($1) AND getMonth($2) + 12
                END)
                OR (POSITION('/' IN "events"."monthPeriodicity") = 0 AND CAST("events"."monthPeriodicity" AS double precision) BETWEEN getMonth($1) AND getMonth($2))`
            , [searchStart, searchEnd]);
    let res: returnedEvents = { oneTimeEvents: [], repetitiveEvents: [] };
    events.forEach((val) => {
        if (val.eventDate) {
            const time = val.eventDate.toISOString();
            res.oneTimeEvents.push(
                {
                    id: val.id,
                    title: val.title,
                    message: val.message,
                    time
                }
            );
        } else {
            res.repetitiveEvents.push(
                {
                    id: val.id,
                    title: val.title,
                    message: val.message,
                    time: val.time.toISOString(),
                    dayPeriodicity: val.dayPeriodicity,
                    monthPeriodicity: val.monthPeriodicity,
                    yearPeriodicity: val.yearPeriodicity,
                    dayOfWeekPeriodicity: val.dayOfWeekPeriodicity,
                    weekDayNumber: val.weekDayNumber
                });
        }
    })
    return res;
}
