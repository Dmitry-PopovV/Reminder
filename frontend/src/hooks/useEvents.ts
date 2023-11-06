import { useEffect } from 'react';
import axios from 'axios';
import addMonths from 'date-fns/addMonths';
import subMonths from 'date-fns/subMonths';
import set from 'date-fns/set';
import { useAppSelector, useAppDispatch } from "../store";
import { oneTimeEvent, repetitiveEvent, setEvents, addOneTimeEvents, deleteOneTimeEventById, addRepetitiveEvents, deleteRepetitiveEventById } from "../store/slicers/eventsSlice"

function getInitialMonths() {
    const currentMonth = new Date();
    const previosMonth = set(subMonths(currentMonth, 1), {milliseconds: 0, seconds: 0, minutes: 0, hours: 0, date: 0});
    const nextMonth = set(addMonths(currentMonth, 2), {milliseconds: 0, seconds: 0, minutes: 0, hours: 0, date: 0});

    return [
        previosMonth,
        nextMonth
    ];
}

type postRes = {
    oneTimeEvents: oneTimeEvent[]
    repetitiveEvents: repetitiveEvent[]
}

export function useEvents() {
    const events = useAppSelector((state) => state.events.events);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!events) {
            axios.post<postRes>("/api/events", {months: getInitialMonths()})
                .then((res) => {
                    dispatch(setEvents(res.data));
                });
        }
    }, [])

    function newEvent(event: oneTimeEvent | repetitiveEvent) {
        if(!(event as oneTimeEvent).start) {
            dispatch(addOneTimeEvents([event as oneTimeEvent]));
        } else {
            dispatch(addRepetitiveEvents([event as repetitiveEvent]));
        }
    }

    function deleteEvent(params: {month?: string, id: string}) {
        if(params.month) {
            dispatch(deleteOneTimeEventById(params as {month: string, id: string} ));
        } else {
            dispatch(deleteRepetitiveEventById(params.month as string));
        }
        
    }

    function newMonths(months: Date[]) {
        axios.post<postRes>("/api/events", {months})
                .then((res) => {
                    dispatch(addOneTimeEvents(res.data.oneTimeEvents));
                    dispatch(addRepetitiveEvents(res.data.repetitiveEvents));
                });
    }

    return { events, newEvent, deleteEvent, newMonths };
}
