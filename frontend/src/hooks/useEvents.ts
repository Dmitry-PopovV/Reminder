import { useEffect } from 'react';
import axios from 'axios';
import { useAppSelector, useAppDispatch } from "../store";
import { Event, setEvents, addEvent, deleteEventById } from "../store/slicers/eventsSlice"

function getInitialLoadedMonths() {
    const currentDate = new Date(Date.now());
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    return [
        `${year - (month - 1 < 0 ? 1 : 0)}-${(month - 1) % 12}`,
        `${year}-${month}`,
        `${year + (month + 1 > 12 ? 1 : 0)}-${(month + 1) % 12}`
    ];
}

export function useEvents() {
    const events = useAppSelector((state) => state.events.events);
    const dispatch = useAppDispatch();
    let loadedMonths: string[] = [];
    if(events) {
        loadedMonths = Object.keys(events);
    }

    useEffect(() => {
        if (!events) {
            axios.post<Event[]>("/api/events", getInitialLoadedMonths())
                .then((res) => {
                    dispatch(setEvents(res.data));
                })
                .catch(() => {
                    dispatch(setEvents([]));
                });
        }
    }, [])

    function newEvent(event: Event) {
        dispatch(addEvent(event));
    }

    function deleteEvent(id: string) {
        dispatch(deleteEventById(id));
    }

    function newMonth(month: string) {
        axios.post<Event[]>("/api/events", [month])
                .then((res) => {
                    dispatch(addEvent(res.data[0]));
                });
    }

    return { events: [{ id: "0", title: "Event", start: "2023-10-28" }], newEvent, deleteEvent, newMonth };
}
