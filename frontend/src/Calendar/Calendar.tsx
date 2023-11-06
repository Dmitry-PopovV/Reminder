import { useRef } from 'react';
import { Spinner } from 'react-bootstrap';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'
import addMonths from 'date-fns/addMonths';
import subMonths from 'date-fns/subMonths';
import set from 'date-fns/set';
import { useEvents } from '../hooks/useEvents';

const setParams = { milliseconds: 0, seconds: 0, minutes: 0, hours: 0, date: 0 };

export default function Calendar() {
    const { events, newMonths } = useEvents();
    const calendarRef = useRef<FullCalendar>() as React.MutableRefObject<FullCalendar>;

    function updateMonths(date: Date) {
        const currentMonth = date;
        const prevMonth = subMonths(currentMonth, 1);
        const nextMonth = addMonths(currentMonth, 1);

        function toMonthString(date: Date) {
            return `${date.getFullYear()}-${date.getMonth()+1}`;
        }

        let loadedMonths = { prev: false, next: false };
        if (undefined !==(events!.oneTimeEvents[toMonthString(prevMonth)])) {loadedMonths.prev = true};
        if (undefined !==(events!.oneTimeEvents[toMonthString(nextMonth)])) {loadedMonths.next = true};
        if (loadedMonths.prev === false && loadedMonths.next === false) {
            events!.repetitiveEvents.forEach((val) => {
                if (val.monthPeriodicity === `${prevMonth.getUTCMonth()}`) loadedMonths.prev = true
                if (val.monthPeriodicity === `${nextMonth.getUTCMonth()}`) loadedMonths.next = true
            });
        }


        let monthsToSearch: Date[] = []
        if (loadedMonths.prev === false && loadedMonths.next === false) {
            monthsToSearch = [
                set(subMonths(currentMonth, 1), setParams),
                set(addMonths(currentMonth, 2), setParams)
            ];
        }
        if (loadedMonths.prev === false && loadedMonths.next === true) {
            monthsToSearch = [
                set(subMonths(currentMonth, 1), setParams),
                set(currentMonth, setParams)
            ];
        }
        if (loadedMonths.prev === true && loadedMonths.next === false) {
            monthsToSearch = [
                set(addMonths(currentMonth, 1), setParams),
                set(addMonths(currentMonth, 2), setParams)
            ];
        }

        if(monthsToSearch.length !== 0) {
            newMonths(monthsToSearch);
        }
    }

    return events ? (
        <FullCalendar ref={calendarRef}
            plugins={[dayGridPlugin]}
            height="auto"
            initialView="dayGridMonth"
            events={Object.values(events.oneTimeEvents).flat()}
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
                end: 'customPrev,customNext'
            }}
        />) : (
        <Spinner animation="border" />
    );
}
