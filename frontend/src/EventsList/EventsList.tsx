import { Navigate } from 'react-router';
import { useOutletContext } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import format from 'date-fns/format';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import differenceInCalendarMonths from 'date-fns/differenceInCalendarMonths';
import differenceInCalendarYears from 'date-fns/differenceInCalendarYears';
import getDay from 'date-fns/getDay';
import parse from 'date-fns/parse';
import startOfMonth from 'date-fns/startOfMonth';
import startOfWeek from 'date-fns/startOfWeek';
import addDays from 'date-fns/addDays';
import isSameDay from 'date-fns/isSameDay';
import { Select } from "../types/Select";
import { useEvents } from '../hooks/useEvents';
import { RepetitiveEvent } from '../store/slicers/eventsSlice';

function isEventOnThisDay(event: RepetitiveEvent, date: string) {
    const splitedDate = date.split('-');
    return (
        (
            (event.monthPeriodicity === '*' || Number(event.monthPeriodicity) === Number(splitedDate[1]) - 1)
            && (event.dayPeriodicity === '*' || Number(event.dayPeriodicity) === Number(splitedDate[2]))
        )
        || (event.dayPeriodicity.match(/^.\/.$/) && (differenceInCalendarDays(new Date(event.time), parse(date, "y-MM-dd", new Date())) % Number(event.dayPeriodicity.split('/')[1]) === 0))
        || (
            (event.monthPeriodicity.match(/^.\/.$/) && (differenceInCalendarMonths(new Date(event.time), parse(date, "y-MM-dd", new Date())) % Number(event.monthPeriodicity.split('/')[1]) === 0))
            && (
                Number(event.dayPeriodicity) === Number(splitedDate[2]) || (
                    Number(event.dayOfWeekPeriodicity) === getDay(parse(date, "y-MM-dd", new Date())) && (isSameDay(parse(date, "y-MM-dd", new Date()), addDays(startOfWeek(startOfMonth(parse(date, "y-MM-dd", new Date()))), Number(event.dayOfWeekPeriodicity) + 7 * (Number(event.weekDayNumber) - (getDay(startOfMonth(parse(date, "y-MM-dd", new Date()))) > Number(event.dayOfWeekPeriodicity) ? 0 : 1)))))
                )
            )
        )
    ) && (event.yearPeriodicity === '*' || (event.yearPeriodicity.match(/^.\/.$/) && (differenceInCalendarYears(new Date(event.time), parse(date, "y-MM-dd", new Date())) % Number(event.yearPeriodicity.split('/')[1]) === 0)));
}

export default function EventsList() {
    const { select, setSelect } = useOutletContext<{ select: Select, setSelect: (param: Select) => void }>();
    const { events } = useEvents();

    let list: JSX.Element[] = [];

    function onClick(eventID: string) {
        return () => {
            setSelect({
                view: "redactor",
                eventID,
                date: select.date!,
                isNew: true
            });
        }
    }

    if (events && select.view === "day") {
        const splitedDate = select.date.split('-');
        const month = `${splitedDate[0]}-${splitedDate[1]}`;

        const oneTimeEvents = events.oneTimeEvents[month] ? events.oneTimeEvents[month].filter((event) => { return event.start === select.date }) : [];
        const repetitiveEvents = events.repetitiveEvents.filter((event) => isEventOnThisDay(event, select.date));

        for (let i = 0; i < oneTimeEvents.length; i++) {
            list.push(
                <Button
                    className='w-100'
                    variant='primary'
                    key={i}
                    onClick={onClick(oneTimeEvents[i].id)}
                >
                    {`${oneTimeEvents[i].title}: ${format(new Date(oneTimeEvents[i].time), "HH:mm")}`}
                </Button>
            )
        }
        for (let i = 0; i < repetitiveEvents.length; i++) {
            list.push(
                <Button
                    className='w-100'
                    variant='success'
                    key={i + "r"}
                    onClick={onClick(repetitiveEvents[i].id)}
                >
                    {`${repetitiveEvents[i].title}: ${format(new Date(repetitiveEvents[i].time), "HH:mm")}`}
                </Button>
            )
        }
    }


    if (!events || select.view === "noSelection") {
        return (<></>);
    }
    if (select.view === "redactor") {
        return (<Navigate to={"/calendar/redactor"} />);
    }
    return (
        <Container fluid>
            <Row xs={1} className='gy-1'>
                {list}
                <Button
                    className='w-100'
                    variant='secondary'
                    onClick={onClick('')}
                >
                    New event
                </Button>
            </Row>
        </Container>
    )
}
