import style from "./EventList.module.scss";
import { Navigate } from 'react-router';
import { useOutletContext } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import format from 'date-fns/format';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import differenceInCalendarWeeks from 'date-fns/differenceInCalendarWeeks';
import differenceInCalendarMonths from 'date-fns/differenceInCalendarMonths';
import differenceInCalendarYears from 'date-fns/differenceInCalendarYears';
import getDay from 'date-fns/getDay';
import parse from 'date-fns/parse';
import startOfMonth from 'date-fns/startOfMonth';
import startOfWeek from 'date-fns/startOfWeek';
import addDays from 'date-fns/addDays';
import isSameDay from 'date-fns/isSameDay';
import isBefore from 'date-fns/isBefore';;
import { Select } from "../Layout/Layout";
import { useEvents } from '../../hooks/useEvents';
import { RepetitiveEvent } from '../../store/slicers/eventsSlice';
import { useScrollDown } from '../../hooks/useScrollDown';
import AlertFlashingOnUpdate from "../AlertFlashingOnUpdate/AlertFlashingOnUpdate";

function isEventOnThisDay(event: RepetitiveEvent, date: string) {
    const splitedDate = date.split('-');
    const parsedDate = parse(date, "y-MM-dd", new Date());

    const isMonthCorrectNumber = Number(event.monthPeriodicity) === Number(splitedDate[1]) - 1;
    const isDayCorrectNumber = Number(event.dayPeriodicity) === Number(splitedDate[2]);

    const isDayPeriod = event.dayPeriodicity.match(/^.\/.$/);
    const doesDayPeriodMatch = differenceInCalendarDays(new Date(event.time), parsedDate) % Number(event.dayPeriodicity.split('/')[1]) === 0;

    const isWeekPeriod = event.dayOfWeekPeriodicity.match(/^.\/.$/);
    const doesWeekPeriodMatch = differenceInCalendarWeeks(new Date(event.time), parsedDate) % Number(event.dayOfWeekPeriodicity.split('/')[1]) === 0;

    const isMonthPeriod = event.monthPeriodicity.match(/^.\/.$/);
    const doesMonthPeriodMatch = differenceInCalendarMonths(new Date(event.time), parsedDate) % Number(event.monthPeriodicity.split('/')[1]) === 0;

    const isDayOfWeekCorrectNumber = Number(event.dayOfWeekPeriodicity.split('/')[0]) === getDay(parsedDate);
    const isDayOfWeekThisDay = isSameDay(parsedDate, addDays(startOfWeek(startOfMonth(parsedDate)), Number(event.dayOfWeekPeriodicity) + 7 * (Number(event.weekDayNumber) - (getDay(startOfMonth(parsedDate)) > Number(event.dayOfWeekPeriodicity) ? 0 : 1))));

    const isYearAny = event.yearPeriodicity === '*';
    const isYearPeriod = event.yearPeriodicity.match(/^.\/.$/);
    const doesYearPeriodMatch = differenceInCalendarYears(new Date(event.time), parsedDate) % Number(event.yearPeriodicity.split('/')[1]) === 0;

    const isAfterCreation = isBefore(new Date(event.time), parsedDate) || isSameDay(new Date(event.time), parsedDate);
    return (
        (isMonthCorrectNumber && isDayCorrectNumber)
        || (isDayPeriod && doesDayPeriodMatch)
        || (isWeekPeriod && doesWeekPeriodMatch && isDayOfWeekCorrectNumber)
        || (
            (isMonthPeriod && doesMonthPeriodMatch)
            && (isDayCorrectNumber || (isDayOfWeekCorrectNumber && isDayOfWeekThisDay))
        )
    ) && (isYearAny || (isYearPeriod && doesYearPeriodMatch))
        && isAfterCreation;
}

export default function EventsList() {
    const { select, setSelect } = useOutletContext<{ select: Select, setSelect: (param: Select) => void }>();
    const { events } = useEvents();
    useScrollDown(select);

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
                    data-time={format(new Date(oneTimeEvents[i].time), "HH:mm")}
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
                    data-time={format(new Date(repetitiveEvents[i].time), "HH:mm")}
                >
                    {`${repetitiveEvents[i].title}: ${format(new Date(repetitiveEvents[i].time), "HH:mm")}`}
                </Button>
            )
        }
        list.sort((a, b) => {
            if (a.props["data-time"] < b.props["data-time"]) {
                return -1;
            } else {
                return 1;
            }
        })
    }


    if (!events || select.view === "noSelection") {
        return (<></>);
    }
    if (select.view === "redactor") {
        return (<Navigate to={"/calendar/redactor"} />);
    }
    return (
        <Container fluid className="mb-3">
            <AlertFlashingOnUpdate text={select.date} />
            <Row xs={1} className='gy-2'>
                <div className={style.list + " pb-3"}>
                    <Row className="gy-1">
                        {list}
                    </Row>
                </div>
                <Button
                    className='w-100'
                    variant='outline-secondary'
                    onClick={onClick('')}
                    data-testid="newEventButton"
                >
                    New event
                </Button>
            </Row>
        </Container>
    )
}
