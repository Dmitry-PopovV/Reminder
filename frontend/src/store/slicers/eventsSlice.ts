import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Event = {
    id: string
    title: string
    start: string
}

export type MonthEvents = {
    [month: string]: Event[]
}

export type InitialState = {
    events: MonthEvents | null | undefined
}
const initialState: InitialState = {
    events: undefined
};

function cutDay(date: string) {
    const splitedDate = date.split('-');
    return `${splitedDate[0]}-${splitedDate[1]}`;
}

function safePush(obj: MonthEvents, key: string, item: Event) {
    if (!obj[key]) obj[key] = [];
    obj[key].push(item);
}

function eventsListToMonthEvents(eventsList: Event[] | null) {
    if (!eventsList) return null;
    const monthEvents: MonthEvents = {};
    eventsList.forEach((val) => { safePush(monthEvents, cutDay(val.start), val) });
    return monthEvents;
}

export const eventSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        setEvents: (state, action: PayloadAction<Event[] | null>) => {
            state.events = eventsListToMonthEvents(action.payload);
        },
        addEvent: (state, action: PayloadAction<Event>) => {
            if (!state.events) throw new Error("'events' is not initialaized");

            safePush(state.events, cutDay(action.payload.start), action.payload);
        },
        deleteEventById: (state, action: PayloadAction<string>) => {
            if (!state.events) throw new Error("'events' is not initialaized");

            const eventsList = Object.values(state.events).flat();
            const elIndex = eventsList.findIndex((el: Event) => el.id === action.payload);
            state.events = eventsListToMonthEvents(eventsList.splice(elIndex, 0));
        }
    }
});

export const { setEvents, addEvent, deleteEventById } = eventSlice.actions;
export default eventSlice.reducer;
