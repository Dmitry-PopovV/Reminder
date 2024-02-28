import { useRef } from 'react';
import { Spinner } from 'react-bootstrap';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import addMonths from 'date-fns/addMonths';
import subMonths from 'date-fns/subMonths';
import set from 'date-fns/set';
import eachDayOfInterval from 'date-fns/eachDayOfInterval';
import eachWeekOfInterval from 'date-fns/eachWeekOfInterval';
import eachMonthOfInterval from 'date-fns/eachMonthOfInterval';
import addDays from 'date-fns/addDays';
import getMinutes from 'date-fns/getMinutes';
import getHours from 'date-fns/getHours';
import getDay from 'date-fns/getDay';
import addWeeks from 'date-fns/addWeeks';
import eachYearOfInterval from 'date-fns/eachYearOfInterval';
import format from 'date-fns/format';
import isBefore from 'date-fns/isBefore';
import isAfter from 'date-fns/isAfter';
import startOfWeek from 'date-fns/startOfWeek';
import { useEvents } from '../hooks/useEvents';
import { Select } from '../types/Select';
import { AllEvents, OneTimeEvent } from '../store/slicers/eventsSlice';
import getRepeatPeriod from '../functions/getRepeatPeriod';

const setParams = { milliseconds: 0, seconds: 0, minutes: 0, hours: 0, date: 0 };

export default function Calendar({ setSelect }: { setSelect: (param: Select) => void }) {
    const { events, loadedMonths, newMonths } = useEvents();
    const calendarRef = useRef<FullCalendar>() as React.MutableRefObject<FullCalendar>;


    function updateMonths(date: Date) {
        const currentMonth = date;
        const prevMonth = subMonths(currentMonth, 1);
        const nextMonth = addMonths(currentMonth, 1);

        function toMonthString(date: Date) {
            return `${date.getFullYear()}-${date.getMonth() + 1}`;
        }

        let loadedMonths = { prev: false, next: false };
        if (events!.oneTimeEvents[toMonthString(prevMonth)] !== undefined) { loadedMonths.prev = true };
        if (events!.oneTimeEvents[toMonthString(nextMonth)] !== undefined) { loadedMonths.next = true };
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

        if (monthsToSearch.length !== 0) {
            newMonths(monthsToSearch);
        }
    }

    function onDateClick(arg: any) {
        setSelect({
            view: "day",
            date: arg.dateStr,
            eventID: null
        })
    }

    function onEventClick(arg: any) {
        setSelect({
            view: "redactor",
            date: arg.event.startStr,
            eventID: arg.event.id,
            isNew: true
        })
    }

    function toCalendarEvents(events: AllEvents, calendarStart: Date, calendarEnd: Date) {
        let calendarRepetitiveEvents: (OneTimeEvent & { color: string })[] = [];
        events.repetitiveEvents.forEach((val) => {
            let newEvents: OneTimeEvent[] = [];
            let dates: Date[] = [];
            let monthStarts: Date[];

            let step: number;
            switch (getRepeatPeriod(val)) {
                case "day":
                    dates = eachDayOfInterval(
                        {
                            start: new Date(val.time),
                            end: new Date(loadedMonths!.end!)
                        },
                        {
                            step: Number(val.dayPeriodicity.split('/')[1])
                        }
                    );
                    break;
                case "week":
                    const weekStarts = eachWeekOfInterval(
                        {
                            start: new Date(val.time),
                            end: new Date(loadedMonths!.end!)
                        }
                    );
                    step = Number(val.dayOfWeekPeriodicity.split('/')[1]);
                    weekStarts.forEach((date, i) => {
                        if (i % step === 0) {
                            dates.push(
                                set(
                                    addDays(date, Number(val.dayOfWeekPeriodicity.split('/')[0])),
                                    {
                                        hours: getHours(new Date(val.time)),
                                        minutes: getMinutes(new Date(val.time))
                                    }
                                )
                            );
                        }
                    })
                    break;
                case "month-date":
                    monthStarts = eachMonthOfInterval(
                        {
                            start: new Date(val.time),
                            end: new Date(loadedMonths!.end!)
                        }
                    );
                    step = Number(val.monthPeriodicity.split('/')[1]);
                    monthStarts.forEach((date, i) => {
                        if (i % step === 0) {
                            dates.push(
                                set(
                                    date,
                                    {
                                        date: Number(val.dayPeriodicity),
                                        hours: getHours(new Date(val.time)),
                                        minutes: getMinutes(new Date(val.time))
                                    }
                                )
                            );
                        }
                    })
                    break;
                case "month-weekday":
                    monthStarts = eachMonthOfInterval(
                        {
                            start: new Date(val.time),
                            end: new Date(loadedMonths!.end!)
                        }
                    );
                    step = Number(val.monthPeriodicity.split('/')[1]);
                    monthStarts.forEach((date, i) => {
                        if (i % step === 0) {
                            const startWeekDay = getDay(date);
                            if (Number(val.dayOfWeekPeriodicity) >= startWeekDay) {
                                dates.push(
                                    set(
                                        addWeeks(
                                            addDays(
                                                startOfWeek(date),
                                                Number(val.dayOfWeekPeriodicity.split('/')[0])
                                            ),
                                            val.weekDayNumber - 1
                                        ),
                                        {
                                            hours: getHours(new Date(val.time)),
                                            minutes: getMinutes(new Date(val.time))
                                        }
                                    )
                                );
                            } else {
                                dates.push(
                                    set(
                                        addWeeks(
                                            addDays(
                                                startOfWeek(date),
                                                Number(val.dayOfWeekPeriodicity.split('/')[0]) + 7
                                            ),
                                            val.weekDayNumber - 1
                                        ),
                                        {
                                            hours: getHours(new Date(val.time)),
                                            minutes: getMinutes(new Date(val.time))
                                        }
                                    )
                                );
                            }

                        }
                    })
                    break;
                case "year":
                    step = Number(val.yearPeriodicity.split('/')[1]);
                    const yearStarts = eachYearOfInterval(
                        {
                            start: new Date(val.time),
                            end: new Date(loadedMonths!.end!)
                        }
                    );
                    yearStarts.forEach((date, i) => {
                        if (i % step === 0) {
                            dates.push(
                                set(
                                    date,
                                    {
                                        month: Number(val.monthPeriodicity),
                                        date: Number(val.dayPeriodicity),
                                        hours: getHours(new Date(val.time)),
                                        minutes: getMinutes(new Date(val.time))
                                    }
                                )
                            );
                        }
                    })
                    break;
            }

            dates = dates.filter((val) => { return isBefore(val, calendarEnd) && isAfter(val, calendarStart) });

            dates.forEach((date, i) => {
                newEvents.push({
                    id: val.id + "@" + i,
                    title: val.title,
                    message: val.message,
                    start: format(new Date(date), "y-MM-dd"),
                    time: date.toISOString()
                })
            })
            calendarRepetitiveEvents = calendarRepetitiveEvents.concat(newEvents.map((val) => { return { color: "green", ...val } }));
        })
        return [...Object.values(events.oneTimeEvents).flat().concat(calendarRepetitiveEvents)];
    }

    return events ? (
        <FullCalendar ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            height="auto"
            initialView="dayGridMonth"
            eventSources={[{ events: (info, callBack) => { callBack(toCalendarEvents(events, info.start, info.end)) } }]}
            dateClick={onDateClick}
            eventClick={onEventClick}
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
