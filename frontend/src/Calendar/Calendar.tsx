import { useRef } from 'react';
import { Spinner } from 'react-bootstrap';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'
import addMonths from 'date-fns/addMonths';
import subMonths from 'date-fns/subMonths';
import { useEvents } from '../hooks/useEvents';

export default function Calendar() {
    const { events, newMonths } = useEvents();
    const calendarRef = useRef<FullCalendar>() as React.MutableRefObject<FullCalendar>;

    function updateMonths(date: Date) {
        const currentMonth = date;
        const prevMonth = subMonths(currentMonth, 1);
        const nextMonth = addMonths(currentMonth, 1);

        function toMonthString(date: Date) {
            return `${date.getFullYear()}-${date.getMonth()}`;
        }

        let notLoadedMonths = [];
        if(!events[toMonthString(currentMonth)]) notLoadedMonths.push(currentMonth);
        if(!events[toMonthString(prevMonth)]) notLoadedMonths.push(prevMonth);
        if(!events[toMonthString(nextMonth)]) notLoadedMonths.push(nextMonth);

        newMonths(notLoadedMonths);
    }

    return events ? (
        <FullCalendar ref={calendarRef}
            plugins={[dayGridPlugin]}
            height="auto"
            initialView="dayGridMonth"
            events={Object.values(events).flat()}
            customButtons={{
                customNext: {
                    icon: 'chevron-right',
                    click: function () {
                        let calendarApi = calendarRef.current.getApi();
                        calendarApi.next();
                        updateMonths(calendarApi.getDate());
                    }
                },
                customPrev: {
                    icon: 'chevron-left',
                    click: function () {
                        let calendarApi = calendarRef.current.getApi();
                        calendarApi.prev();
                        updateMonths(calendarApi.getDate());
                    }
                }
            }}
            headerToolbar={{
                start: 'title',
                center: '',
                end: 'today customPrev,customNext'
            }}
        />) : (
        <Spinner animation="border" />
    );
}
