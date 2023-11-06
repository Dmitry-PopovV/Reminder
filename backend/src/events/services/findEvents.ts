import { Events } from "../../entity/Events";

type returnedEvents = {
    oneTimeEvents: {
        id: string
        title: string
        message: string
        start: string
        hour: string
    }[],
    repetitiveEvents: {
        id: string
        title: string
        message: string
        hourPeriodicity: string
        dayPeriodicity: string
        weekPeriodicity: string
        monthPeriodicity: string
        yearPeriodicity: string
    }[]
}

export async function findEvents(months: string[]) {
    const searchStart = new Date(months[0]);
    const searchEnd = new Date(months[1]);
    const events = await Events
        .createQueryBuilder("events")
        .where(
            `events.sendingDate BETWEEN :searchStart AND :searchEnd 
            OR events.monthPeriodicity = '*' 
            OR CAST(events.monthPeriodicity AS double precision) BETWEEN EXTRACT(MONTH FROM CAST(:searchStart AS TIMESTAMP)) AND EXTRACT(MONTH FROM CAST(:searchEnd AS TIMESTAMP))`
            , { searchStart, searchEnd })
        .getMany();
    let res: returnedEvents = { oneTimeEvents: [], repetitiveEvents: [] };
    events.forEach((val) => {
        if (val.sendingDate) {
            const [start, time] = val.sendingDate.toISOString().split('T');
            const hour = time.split(':')[0];
            res.oneTimeEvents.push(
                {
                    id: val.id,
                    title: val.title,
                    message: val.message,
                    start,
                    hour
                }
            );
        } else {
            res.repetitiveEvents.push(
                {
                    id: val.id,
                    title: val.title,
                    message: val.message,
                    hourPeriodicity: val.hourPeriodicity,
                    dayPeriodicity: val.dayPeriodicity,
                    weekPeriodicity: val.weekPeriodicity,
                    monthPeriodicity: val.monthPeriodicity,
                    yearPeriodicity: val.yearPeriodicity
                });
        }
    })
    return res;
}
