import { Event } from "../../entity/Event";

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

export async function findEvents(months: string[], email: string) {
    const searchStart = new Date(months[0]);
    const searchEnd = new Date(months[1]);
    const events: Event[] = await Event
        .query(
            `SELECT * FROM "event" WHERE "event"."userEmail" = $3 AND 
                ("event"."eventDate" BETWEEN $1 AND $2
                OR "event"."monthPeriodicity" = '*'
                OR (
                    POSITION('/' IN "event"."monthPeriodicity") != 0 AND
                    CASE
                        WHEN getMonth($1) < getMonth($2) THEN
                            getMonth($1)
                            - MOD(getMonth($1), getPeriodicity("event"."monthPeriodicity"))
                            + getPeriodicity("event"."monthPeriodicity")
                            BETWEEN getMonth($1) AND getMonth($2)
                        WHEN getMonth($1) >= getMonth($2) THEN
                            getMonth($1)
                            - MOD(getMonth($1), getPeriodicity("event"."monthPeriodicity"))
                            + getPeriodicity("event"."monthPeriodicity")
                            > getMonth($1)
                            OR getMonth($1)
                            - MOD(getMonth($1), getPeriodicity("event"."monthPeriodicity"))
                            + getPeriodicity("event"."monthPeriodicity")
                            < getMonth($2)
                    END
                )
                OR (
                    CASE
                        WHEN getMonth($1) < getMonth($2) THEN
                            POSITION('/' IN "event"."monthPeriodicity") = 0 AND
                            CAST("event"."monthPeriodicity" AS double precision)
                            BETWEEN getMonth($1) AND getMonth($2)
                        WHEN getMonth($1) >= getMonth($2) THEN
                            POSITION('/' IN "event"."monthPeriodicity") = 0 AND
                            (
                                CAST("event"."monthPeriodicity" AS double precision) > getMonth($1)
                                OR CAST("event"."monthPeriodicity" AS double precision) < getMonth($2)
                            )
                    END
                ))`
            , [searchStart, searchEnd, email]);
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
                    time: val.time!.toISOString(),
                    dayPeriodicity: val.dayPeriodicity as string,
                    monthPeriodicity: val.monthPeriodicity as string,
                    yearPeriodicity: val.yearPeriodicity as string,
                    dayOfWeekPeriodicity: val.dayOfWeekPeriodicity as string,
                    weekDayNumber: val.weekDayNumber as number
                });
        }
    })
    return res;
}
