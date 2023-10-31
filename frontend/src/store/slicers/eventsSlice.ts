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

function safePush(monthEvents: MonthEvents, month: string, event: Event) {
    if (!monthEvents[month]) monthEvents[month] = [];
    monthEvents[month].push(event);
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
        addEvents: (state, action: PayloadAction<Event[]>) => {
            if (!state.events) throw new Error("'events' is not initialaized");

            action.payload.forEach((val)=>{ safePush(state.events!, cutDay(val.start), val); })
        },
        deleteEventById: (state, action: PayloadAction<{month: string, id: string}>) => {
            if (!state.events) throw new Error("'events' is not initialaized");

            const elIndex = state.events[action.payload.month].findIndex((el: Event) => el.id === action.payload.id);
            state.events[action.payload.month].splice(elIndex, 0);
        }
    }
});

export const { setEvents, addEvents, deleteEventById } = eventSlice.actions;
export default eventSlice.reducer;
