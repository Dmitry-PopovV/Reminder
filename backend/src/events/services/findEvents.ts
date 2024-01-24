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
    const events = await Events
        .createQueryBuilder("events")
        .where(
            `events.eventDate BETWEEN :searchStart AND :searchEnd 
            OR events.monthPeriodicity = '*' 
            OR (POSITION('/' IN events.monthPeriodicity) != 0 AND
            CASE
            WHEN EXTRACT(MONTH FROM CAST(:searchStart AS TIMESTAMP)) < EXTRACT(MONTH FROM CAST(:searchEnd AS TIMESTAMP)) THEN
            EXTRACT(MONTH FROM CAST(:searchStart AS TIMESTAMP)) 
            - MOD(EXTRACT(MONTH FROM CAST(:searchStart AS TIMESTAMP)), 
            CAST(substring(events.monthPeriodicity from POSITION('/' IN events.monthPeriodicity) + 1 for char_length(events.monthPeriodicity)) AS numeric)) 
            + CAST(substring(events.monthPeriodicity from POSITION('/' IN events.monthPeriodicity) + 1 for char_length(events.monthPeriodicity)) AS numeric) BETWEEN EXTRACT(MONTH FROM CAST(:searchStart AS TIMESTAMP)) AND EXTRACT(MONTH FROM CAST(:searchEnd AS TIMESTAMP)) 
            WHEN EXTRACT(MONTH FROM CAST(:searchStart AS TIMESTAMP)) >= EXTRACT(MONTH FROM CAST(:searchEnd AS TIMESTAMP)) THEN
            EXTRACT(MONTH FROM CAST(:searchStart AS TIMESTAMP)) 
            - MOD(EXTRACT(MONTH FROM CAST(:searchStart AS TIMESTAMP)), 
            CAST(substring(events.monthPeriodicity from POSITION('/' IN events.monthPeriodicity) + 1 for char_length(events.monthPeriodicity)) AS numeric)) 
            + CAST(substring(events.monthPeriodicity from POSITION('/' IN events.monthPeriodicity) + 1 for char_length(events.monthPeriodicity)) AS numeric) BETWEEN EXTRACT(MONTH FROM CAST(:searchStart AS TIMESTAMP)) AND EXTRACT(MONTH FROM CAST(:searchEnd AS TIMESTAMP)) + 12 
            END)
            OR (POSITION('/' IN events.monthPeriodicity) = 0 AND CAST(events.monthPeriodicity AS double precision) BETWEEN EXTRACT(MONTH FROM CAST(:searchStart AS TIMESTAMP)) AND EXTRACT(MONTH FROM CAST(:searchEnd AS TIMESTAMP)))`
            , { searchStart, searchEnd })
        .getMany();
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
