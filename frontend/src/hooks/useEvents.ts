import { useEffect } from 'react';
import axios from 'axios';
import { useAppSelector, useAppDispatch } from "../store";
import { Event, setEvents, addEvent, deleteEventById } from "../store/slicers/eventsSlice"

export function useEvents() {
    const events = useAppSelector((state) => state.events.events);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!events) {
            axios.post("/api/events")
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

    function deleteEvent(id: string){
        dispatch(deleteEventById(id));
    }

    return { events: [{id: "0", title: "Event", start: "2023-10-28"}], newEvent, deleteEvent };
}
