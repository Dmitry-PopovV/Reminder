import { Event } from "../../entity/Event";
import { User } from "../../entity/User";

type EventData = {
    id: string
    title: string
    message: string
    eventDate: string
    time: string
    dayPeriodicity: string
    monthPeriodicity: string
    yearPeriodicity: string
    dayOfWeekPeriodicity: string
    weekDayNumber: number
}

function toNullIfUndefined<T>(item: T) {
    return item !== undefined ? item : null;
}

async function newEvent(eventData: EventData, email: string) {
    const event = new Event();
    event.title = eventData.title;
    event.message = eventData.message;
    event.eventDate = eventData.eventDate ? new Date(eventData.eventDate) : null;
    event.time = eventData.time ? new Date(eventData.time) : null;
    event.dayPeriodicity = toNullIfUndefined(eventData.dayPeriodicity);
    event.monthPeriodicity = toNullIfUndefined(eventData.monthPeriodicity);
    event.yearPeriodicity = toNullIfUndefined(eventData.yearPeriodicity);
    event.dayOfWeekPeriodicity = toNullIfUndefined(eventData.dayOfWeekPeriodicity);
    event.weekDayNumber = toNullIfUndefined(eventData.weekDayNumber);

    const relation = new User()
    relation.email = email;
    event.user = relation;
    await event.save();
    return event.id;
}

async function updateEvent(eventData: EventData, email: string) {
    const event = await Event.findOneOrFail({
        where: { id: eventData.id },
        relations: { user: true }
    });

    if (event.user.email !== email) {
        throw new Error("Attempt to access another's event");
    }

    event.title = eventData.title;
    event.message = eventData.message;
    event.eventDate = eventData.eventDate ? new Date(eventData.eventDate) : null;
    event.time = eventData.time ? new Date(eventData.time) : null;
    event.dayPeriodicity = toNullIfUndefined(eventData.dayPeriodicity);
    event.monthPeriodicity = toNullIfUndefined(eventData.monthPeriodicity);
    event.yearPeriodicity = toNullIfUndefined(eventData.yearPeriodicity);
    event.dayOfWeekPeriodicity = toNullIfUndefined(eventData.dayOfWeekPeriodicity);
    event.weekDayNumber = toNullIfUndefined(eventData.weekDayNumber);

    await event.save();
}

export async function saveEvent(eventData: EventData, email: string) {
    if (eventData.id === '') {
        return await newEvent(eventData, email);
    } else {
        await updateEvent(eventData, email);
        return eventData.id;
    }
}
