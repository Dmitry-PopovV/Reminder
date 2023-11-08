import { useEffect } from 'react';
import axios from 'axios';
import addMonths from 'date-fns/addMonths';
import subMonths from 'date-fns/subMonths';
import set from 'date-fns/set';
import { useAppSelector, useAppDispatch } from "../store";
import { OneTimeEvent, RepetitiveEvent, setEvents, addOneTimeEvents, deleteOneTimeEvent, addRepetitiveEvents, deleteRepetitiveEvent } from "../store/slicers/eventsSlice"

function getInitialMonths() {
    const currentMonth = new Date();
    const previosMonth = set(subMonths(currentMonth, 1), { milliseconds: 0, seconds: 0, minutes: 0, hours: 0, date: 0 });
    const nextMonth = set(addMonths(currentMonth, 2), { milliseconds: 0, seconds: 0, minutes: 0, hours: 0, date: 0 });

    return [
        previosMonth,
        nextMonth
    ];
}

type GetRes = {
    oneTimeEvents: OneTimeEvent[]
    repetitiveEvents: RepetitiveEvent[]
}

export function useEvents() {
    const events = useAppSelector((state) => state.events.events);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!events) {
            axios.get<GetRes>("/api/events", { params: { months: getInitialMonths() } })
                .then((res) => {
                    dispatch(setEvents(res.data));
                });
        }
    }, [])

    function newEvent(event: OneTimeEvent | RepetitiveEvent) {
        if (!(event as OneTimeEvent).start) {
            dispatch(addOneTimeEvents([event as OneTimeEvent]));
        } else {
            dispatch(addRepetitiveEvents([event as RepetitiveEvent]));
        }
    }

    function deleteEvent(id: string, month?: string) {
        if (month) {
            dispatch(deleteOneTimeEvent({ month, id }));
        } else {
            dispatch(deleteRepetitiveEvent(id));
        }

    }

    function newMonths(months: Date[]) {
        axios.get<GetRes>("/api/events", { params: { months } })
            .then((res) => {
                dispatch(addOneTimeEvents(res.data.oneTimeEvents));
                dispatch(addRepetitiveEvents(res.data.repetitiveEvents));
            });
    }

    return { events, newEvent, deleteEvent, newMonths };
}
