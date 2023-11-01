import { useEffect } from 'react';
import axios from 'axios';
import addMonths from 'date-fns/addMonths';
import subMonths from 'date-fns/subMonths';
import { useAppSelector, useAppDispatch } from "../store";
import { Event, MonthEvents, setEvents, addEvents, deleteEventById } from "../store/slicers/eventsSlice"

function getInitialMonths() {
    const currentMonth = new Date();
    const previosMonth = subMonths(currentMonth, 1);
    const nextMonth = addMonths(currentMonth, 1);

    console.log(previosMonth.toISOString(),"\n", currentMonth.toISOString(),"\n", nextMonth.toISOString())

    return [
        previosMonth,
        currentMonth,
        nextMonth
    ];
}

export function useEvents() {
    const events = useAppSelector((state) => state.events.events);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!events) {
            axios.post<Event[]>("/api/events", {months: getInitialMonths()})
                .then((res) => {
                    dispatch(setEvents(res.data));
                });
        }
    }, [])

    function newEvent(event: Event) {
        dispatch(addEvents([event]));
    }

    function deleteEvent(params: {month: string, id: string}) {
        dispatch(deleteEventById(params));
    }

    function newMonths(months: Date[]) {
        axios.post<Event[]>("/api/events", {months})
                .then((res) => {
                    dispatch(addEvents(res.data));
                });
    }

    return { events: {"2023-10": [{ id: "0", title: "Event", start: "2023-10-28" }]} as MonthEvents , newEvent, deleteEvent, newMonths };
}
