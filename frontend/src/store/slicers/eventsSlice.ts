import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type oneTimeEvent = {
    id: string
    title: string
    message: string
    start: string
    hour: string
}

export type repetitiveEvent = {
    id: string
    title: string
    message: string
    hourPeriodicity: string
    dayPeriodicity: string
    weekPeriodicity: string
    monthPeriodicity: string
    yearPeriodicity: string
}

export type MonthEvents = {
    [month: string]: oneTimeEvent[]
}

export type allEvents = {
    oneTimeEvents: MonthEvents
    repetitiveEvents: repetitiveEvent[]
}

export type InitialState = {
    events: allEvents | null | undefined
}
const initialState: InitialState = {
    events: undefined
};

function cutDay(date: string) {
    const splitedDate = date.split('-');
    return `${splitedDate[0]}-${splitedDate[1]}`;
}

function safePushOneTimeEvent(monthEvents: MonthEvents, month: string, event: oneTimeEvent) {
    if (!monthEvents[month]) monthEvents[month] = [];
    monthEvents[month].push(event);
}

function safePushRepetitiveEvent(allEvents: allEvents, event: repetitiveEvent) {
    if (!allEvents.repetitiveEvents) allEvents.repetitiveEvents = [];
    allEvents.repetitiveEvents.push(event);
}

function OneTimeEventsListToMonthEvents(eventsList: oneTimeEvent[]) {
    const monthEvents: MonthEvents = {};

    eventsList.forEach((val) => { safePushOneTimeEvent(monthEvents, cutDay(val.start), val) });
    return monthEvents;
}

export const eventSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        setEvents: (state, action: PayloadAction<{oneTimeEvents: oneTimeEvent[]; repetitiveEvents: repetitiveEvent[] } | null>) => {
            if (!action.payload) {
                state.events = null;
            } else {
                state.events = { 
                    oneTimeEvents: OneTimeEventsListToMonthEvents(action.payload.oneTimeEvents),
                    repetitiveEvents: action.payload.repetitiveEvents
                };
            }
        },
        addOneTimeEvents: (state, action: PayloadAction<oneTimeEvent[]>) => {
            if (!state.events) throw new Error("'events' is not initialaized");

            action.payload.forEach((val) => { safePushOneTimeEvent(state.events!.oneTimeEvents, cutDay(val.start), val); })
        },
        deleteOneTimeEventById: (state, action: PayloadAction<{ month: string, id: string }>) => {
            if (!state.events) throw new Error("'events' is not initialaized");

            const elIndex = state.events.oneTimeEvents[action.payload.month].findIndex((el: oneTimeEvent) => el.id === action.payload.id);
            state.events.oneTimeEvents[action.payload.month].splice(elIndex, 0);
        },
        addRepetitiveEvents: (state, action: PayloadAction<repetitiveEvent[]>) => {
            if (!state.events) throw new Error("'events' is not initialaized");

            action.payload.forEach((val) => { safePushRepetitiveEvent(state.events!, val); })
        },
        deleteRepetitiveEventById: (state, action: PayloadAction<string>) => {
            if (!state.events) throw new Error("'events' is not initialaized");

            const elIndex = state.events.repetitiveEvents.findIndex((el: repetitiveEvent) => el.id === action.payload);
            state.events.repetitiveEvents.splice(elIndex, 0);
        },
    }
});

export const { setEvents, addOneTimeEvents, deleteOneTimeEventById, addRepetitiveEvents, deleteRepetitiveEventById } = eventSlice.actions;
export default eventSlice.reducer;
