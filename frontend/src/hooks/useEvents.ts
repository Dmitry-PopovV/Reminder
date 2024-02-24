import { useEffect } from 'react';
import axios from 'axios';
import addMonths from 'date-fns/addMonths';
import subMonths from 'date-fns/subMonths';
import set from 'date-fns/set';
import format from 'date-fns/format';
import { useAppSelector, useAppDispatch } from "../store";
import { OneTimeEvent, RepetitiveEvent, setEvents, addOneTimeEvents, deleteAnyEvent, addRepetitiveEvents, updateLoadedMonths } from "../store/slicers/eventsSlice"

function getInitialMonths() {
    const currentMonth = new Date();
    const previosMonth = set(subMonths(currentMonth, 1), { milliseconds: 0, seconds: 0, minutes: 0, hours: 0, date: 0 });
    const nextMonth = set(addMonths(currentMonth, 2), { milliseconds: 0, seconds: 0, minutes: 0, hours: 0, date: 0 });

    return [
        previosMonth,
        nextMonth
    ];
}

function addStartProperty(arr: { id: string; title: string; message: string; time: string; }[]): OneTimeEvent[] {
    return Array.from(arr, (val) => { return { ...val, start: format(new Date(val.time), "y-MM-dd") } })
}

type GetRes = {
    oneTimeEvents: {
        id: string;
        title: string;
        message: string;
        time: string;
    }[]
    repetitiveEvents: RepetitiveEvent[]
}

export function useEvents() {
    const { events, loadedMonths } = useAppSelector((state) => state.events);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!events) {
            axios.get<GetRes>("/api/events", { params: { months: getInitialMonths() } })
                .then((res) => {
                    const newEvents = {
                        oneTimeEvents: addStartProperty(res.data.oneTimeEvents),
                        repetitiveEvents: res.data.repetitiveEvents
                    }
                    dispatch(setEvents(newEvents));
                    const initialMonths = getInitialMonths();
                    dispatch(updateLoadedMonths({
                        start: initialMonths[0].toISOString().split('T')[0],
                        end: initialMonths[1].toISOString().split('T')[0]
                    }))
                });
        }
    }, [])

    function newEvent(event: OneTimeEvent | RepetitiveEvent) {
        if ((event as OneTimeEvent).start) {
            dispatch(addOneTimeEvents([event as OneTimeEvent]));
        } else {
            dispatch(addRepetitiveEvents([event as RepetitiveEvent]));
        }
    }

    function deleteEvent(id: string) {
        dispatch(deleteAnyEvent(id));
    }

    function newMonths(months: Date[]) {
        axios.get<GetRes>("/api/events", { params: { months } })
            .then((res) => {
                dispatch(addOneTimeEvents(addStartProperty(res.data.oneTimeEvents)));
                dispatch(addRepetitiveEvents(res.data.repetitiveEvents));
                dispatch(updateLoadedMonths({
                    start: months[0].toISOString().split('T')[0],
                    end: months[1].toISOString().split('T')[0]
                }))
            });
    }

    return { events, loadedMonths, newEvent, deleteEvent, newMonths };
}
