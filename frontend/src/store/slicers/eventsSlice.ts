import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type OneTimeEvent = {
    id: string
    title: string
    message: string
    start: string
    time: string
}

export type RepetitiveEvent = {
    id: string
    title: string
    message: string
    time: string
    dayPeriodicity: string
    monthPeriodicity: string
    yearPeriodicity: string
    dayOfWeekPeriodicity: string
    weekDayNumber: number
}

export type MonthEvents = {
    [month: string]: OneTimeEvent[]
}

export type AllEvents = {
    oneTimeEvents: MonthEvents
    repetitiveEvents: RepetitiveEvent[]
}

export type LoadedMonths = {
    start: string,
    end: string 
}

export type InitialState = {
    events: AllEvents | null | undefined
    loadedMonths: LoadedMonths | undefined
}
const initialState: InitialState = {
    events: undefined,
    loadedMonths: undefined
};

function cutDay(date: string) {
    const splitedDate = date.split('-');
    return `${splitedDate[0]}-${splitedDate[1]}`;
}

function safePushOneTimeEvent(monthEvents: MonthEvents, month: string, event: OneTimeEvent) {
    if (!monthEvents[month]) monthEvents[month] = [];
    monthEvents[month].push(event);
}

function safePushRepetitiveEvent(allEvents: AllEvents, event: RepetitiveEvent) {
    if (!allEvents.repetitiveEvents) allEvents.repetitiveEvents = [];
    allEvents.repetitiveEvents.push(event);
}

function OneTimeEventsListToMonthEvents(eventsList: OneTimeEvent[]) {
    const monthEvents: MonthEvents = {};

    eventsList.forEach((val) => { safePushOneTimeEvent(monthEvents, cutDay(val.start), val) });
    return monthEvents;
}

export const eventSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        setEvents: (state, action: PayloadAction<{ oneTimeEvents: OneTimeEvent[]; repetitiveEvents: RepetitiveEvent[] } | null>) => {
            if (!action.payload) {
                state.events = null;
            } else {
                state.events = {
                    oneTimeEvents: OneTimeEventsListToMonthEvents(action.payload.oneTimeEvents),
                    repetitiveEvents: action.payload.repetitiveEvents
                };
            }
        },
        addOneTimeEvents: (state, action: PayloadAction<OneTimeEvent[]>) => {
            if (!state.events) throw new Error("'events' is not initialaized");

            action.payload.forEach((val) => {
                if (!state.events!.oneTimeEvents[cutDay(val.start)] && -1 === state.events!.oneTimeEvents[cutDay(val.start)].findIndex((el: OneTimeEvent) => el.id === val.id)) {
                    safePushOneTimeEvent(state.events!.oneTimeEvents, cutDay(val.start), val);
                }
            })
        },
        deleteOneTimeEvent: (state, action: PayloadAction<{ month: string, id: string }>) => {
            if (!state.events) throw new Error("'events' is not initialaized");

            const elIndex = state.events.oneTimeEvents[action.payload.month].findIndex((el: OneTimeEvent) => el.id === action.payload.id);
            state.events.oneTimeEvents[action.payload.month].splice(elIndex, 0);
        },
        addRepetitiveEvents: (state, action: PayloadAction<RepetitiveEvent[]>) => {
            if (!state.events) throw new Error("'events' is not initialaized");

            action.payload.forEach((val) => {
                if (-1 === state.events!.repetitiveEvents.findIndex((el: RepetitiveEvent) => el.id === val.id)) {
                    safePushRepetitiveEvent(state.events!, val);
                }
            })
        },
        deleteRepetitiveEvent: (state, action: PayloadAction<string>) => {
            if (!state.events) throw new Error("'events' is not initialaized");

            const elIndex = state.events.repetitiveEvents.findIndex((el: RepetitiveEvent) => el.id === action.payload);
            state.events.repetitiveEvents.splice(elIndex, 0);
        },
        updateLoadedMonths: (state, action: PayloadAction<LoadedMonths>) => {
            function smallest(first: string, second: string) {
                const splitedFirst = first.split('-');
                const splitedSecond = second.split('-');
                if(Number(splitedFirst[0]) < Number(splitedSecond[0])) {
                    return first;
                } else if(Number(splitedFirst[0]) === Number(splitedSecond[0])) {
                    if(Number(splitedFirst[1]) < Number(splitedSecond[1])) {
                        return first;
                    } else {
                        return second;
                    }
                } else {
                    return second;
                }
            }

            function biggest(first: string, second: string) {
                const splitedFirst = first.split('-');
                const splitedSecond = second.split('-');
                if(Number(splitedFirst[0]) > Number(splitedSecond[0])) {
                    return first;
                } else if(Number(splitedFirst[0]) === Number(splitedSecond[0])) {
                    if(Number(splitedFirst[1]) > Number(splitedSecond[1])) {
                        return first;
                    } else {
                        return second;
                    }
                } else {
                    return second;
                }
            }

            if(!state.loadedMonths) {
                state.loadedMonths = action.payload;
            } else {
                state.loadedMonths.start = smallest(state.loadedMonths.start, action.payload.start);
                state.loadedMonths.end = biggest(state.loadedMonths.end, action.payload.end);
            }
        }
    }
});

export const { setEvents, addOneTimeEvents, deleteOneTimeEvent, addRepetitiveEvents, deleteRepetitiveEvent, updateLoadedMonths } = eventSlice.actions;
export default eventSlice.reducer;
