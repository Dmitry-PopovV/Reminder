import { useRef } from 'react';
import { Navigate } from 'react-router';
import { useOutletContext } from "react-router-dom";
import Form from "react-bootstrap/Form";
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import set from 'date-fns/set';
import format from 'date-fns/format';
import isSameMonth from 'date-fns/isSameMonth';
import subWeeks from 'date-fns/subWeeks';
import getDay from 'date-fns/getDay';
import getDate from 'date-fns/getDate';
import getMonth from 'date-fns/getMonth';
import axios from 'axios';
import { Select } from "../Layout/Layout";
import { useEvents } from '../../hooks/useEvents';
import { OneTimeEvent, RepetitiveEvent } from '../../store/slicers/eventsSlice';
import getRepeatPeriod from '../../functions/getRepeatPeriod';
import useSetup from './useSetup';
import { useScrollDown } from '../../hooks/useScrollDown';


export default function EventsRedactor() {
    const { select, setSelect } = useOutletContext<{ select: Select, setSelect: (param: Select) => void }>();
    return <Redactor select={select} setSelect={setSelect} key={select.eventID} />
}

function Redactor({ select, setSelect }: { select: Select, setSelect: (param: Select) => void }) {
    const { events, newEvent, deleteEvent } = useEvents();
    useScrollDown(select);

    const { isRepetitiveState, isRelatedOnDaysOfWeekState, eventState } = useSetup(events, select);
    const [isRepetitive, setIsRepetitive] = isRepetitiveState;
    const [isRelatedOnDaysOfWeek, setIsRelatedOnDaysOfWeek] = isRelatedOnDaysOfWeekState;
    const [event, setEvent] = eventState;

    const repeatNumberRef = useRef<HTMLInputElement>(null);
    const repeatPeriodRef = useRef<HTMLSelectElement>(null);


    function onExit() {
        if (select.date) {
            setSelect({
                view: "day",
                eventID: null,
                date: select.date
            });
        } else {
            setSelect({
                view: "noSelection",
                eventID: null,
                date: null
            });
        }
    }

    function onChangeTitle(e: any) {
        const newVal = { ...event };
        newVal.title = e.target.value;
        setEvent(newVal);
    }

    function onChangeMessage(e: any) {
        const newVal = { ...event };
        newVal.message = e.target.value;
        setEvent(newVal);
    }

    function onChangeTime(e: any) {
        const newVal = { ...event };
        newVal.time = set(new Date(newVal.time), {
            hours: (e.target.value as string).split(':')[0] as unknown as number,
            minutes: (e.target.value as string).split(':')[1] as unknown as number
        }).toISOString();
        setEvent(newVal);
    }

    function onChangeIsRepetitive() {
        const newIsRepetitive = !isRepetitive;
        let newVal: OneTimeEvent | RepetitiveEvent;

        if (newIsRepetitive) {
            newVal = {
                id: event.id,
                title: event.title,
                message: event.message,
                time: event.time,
                weekDayNumber: 0,
                dayOfWeekPeriodicity: "*",
                dayPeriodicity: "*/1",
                monthPeriodicity: "*",
                yearPeriodicity: "*",
            };
        } else {
            newVal = {
                id: event.id,
                title: event.title,
                message: event.message,
                time: event.time,
                start: select.date!
            };
        }

        setIsRepetitive(newIsRepetitive);
        setEvent(newVal);

    }

    function updateProperties(newVal: RepetitiveEvent, isRelatedOnDaysOfWeek: boolean) {
        const repeatNumber = repeatNumberRef.current!.value;
        const repeatPeriod = repeatPeriodRef.current!.value;

        function getWeekDayNumber(date: Date) {
            let newDate = new Date(date.toISOString());
            let i = 0;
            while (isSameMonth(date, newDate)) {
                i++;
                newDate = subWeeks(newDate, 1);
            }
            return i;
        }

        switch (repeatPeriod) {
            case "day":
                newVal.dayPeriodicity = "*/" + repeatNumber;
                newVal.monthPeriodicity = "*";
                newVal.yearPeriodicity = "*";
                newVal.dayOfWeekPeriodicity = "*";
                newVal.weekDayNumber = 0;
                break;
            case "week":
                newVal.dayPeriodicity = "*";
                newVal.monthPeriodicity = "*";
                newVal.yearPeriodicity = "*";
                newVal.dayOfWeekPeriodicity = getDay(new Date(newVal.time)) + "/" + repeatNumber;
                newVal.weekDayNumber = 0;
                break;
            case "month":
                if (isRelatedOnDaysOfWeek) {
                    newVal.dayPeriodicity = "*";
                    newVal.monthPeriodicity = "*/" + repeatNumber;
                    newVal.yearPeriodicity = "*";
                    newVal.dayOfWeekPeriodicity = '' + getDay(new Date(newVal.time));
                    newVal.weekDayNumber = getWeekDayNumber(new Date(newVal.time));
                } else {
                    newVal.dayPeriodicity = '' + getDate(new Date(newVal.time));
                    newVal.monthPeriodicity = "*/" + repeatNumber;
                    newVal.yearPeriodicity = "*";
                    newVal.dayOfWeekPeriodicity = "*";
                    newVal.weekDayNumber = 0;
                }
                break;
            case "year":
                newVal.dayPeriodicity = '' + getDate(new Date(newVal.time));
                newVal.monthPeriodicity = '' + getMonth(new Date(newVal.time));
                newVal.yearPeriodicity = "*/" + repeatNumber;
                newVal.dayOfWeekPeriodicity = "*";
                newVal.weekDayNumber = 0;
                break;
        }
    }

    function onChangeIsRelatedOnDaysOfWeek() {
        const newVal = { ...(event as RepetitiveEvent) };

        setIsRelatedOnDaysOfWeek(!isRelatedOnDaysOfWeek);
        updateProperties(newVal, !isRelatedOnDaysOfWeek);
        setEvent(newVal);
    }

    function onChangePeriodicity() {
        const newVal = { ...(event as RepetitiveEvent) };

        updateProperties(newVal, isRelatedOnDaysOfWeek);
        setEvent(newVal);
    }

    function toOrdinal(num: number) {
        if (num < 4 || num > 20) {
            const lastDigit = num % 10;
            switch (lastDigit) {
                case 1:
                    return num + 'st';
                case 2:
                    return num + 'nd';
                case 3:
                    return num + 'rd';
            }
        }
        return num + 'th';
    }

    function getDescription() {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        if (isRepetitive && !(event as OneTimeEvent).start) {
            const notNullRepeatPeriod = repeatPeriodRef.current ? repeatPeriodRef.current.value : getRepeatPeriod(event as RepetitiveEvent).split('-')[0];
            switch (notNullRepeatPeriod) {
                case "day":
                    const dayPeriodicity = Number((event as RepetitiveEvent).dayPeriodicity.split('/')[1]);
                    return `Every ${dayPeriodicity} day(s)`;
                case "week":
                    const weekPeriodicity = (event as RepetitiveEvent).dayOfWeekPeriodicity.split('/')[1];
                    const weekdayInWeek = daysOfWeek[Number((event as RepetitiveEvent).dayOfWeekPeriodicity.split('/')[0])];
                    return `Every ${weekPeriodicity} week on ${weekdayInWeek}`;
                case "month":
                    const monthPeriodicity = (event as RepetitiveEvent).monthPeriodicity.split('/')[1];
                    const weekdayNumber = toOrdinal((event as RepetitiveEvent).weekDayNumber);
                    const weekdayInMonth = daysOfWeek[Number((event as RepetitiveEvent).dayOfWeekPeriodicity)];
                    const dateInMonth = toOrdinal(getDate(new Date(event.time)));
                    if (isRelatedOnDaysOfWeek) {
                        return `Every ${monthPeriodicity} month on ${weekdayNumber} ${weekdayInMonth}`;
                    } else {
                        return `Every ${monthPeriodicity} month on ${dateInMonth}`;
                    }
                case "year":
                    const yearPeriodicity = (event as RepetitiveEvent).yearPeriodicity.split('/')[1];
                    const dateInYear = toOrdinal(getDate(new Date(event.time)));
                    const month = months[getMonth(new Date(event.time))];
                    return `Every ${yearPeriodicity} year on ${dateInYear} of ${month}`;
            }
        } else {
            const date = event.time.split('T')[0]
            return `On ${date}`;
        }

    }

    function getRepeatNumber() {
        if ((event as RepetitiveEvent).yearPeriodicity.match(/^.\/.$/)) {
            return (event as RepetitiveEvent).yearPeriodicity.split('/')[1];
        }
        if ((event as RepetitiveEvent).monthPeriodicity.match(/^.\/.$/)) {
            return (event as RepetitiveEvent).monthPeriodicity.split('/')[1];
        }
        if ((event as RepetitiveEvent).dayOfWeekPeriodicity.match(/^.\/.$/)) {
            return (event as RepetitiveEvent).dayOfWeekPeriodicity.split('/')[1];
        }
        return (event as RepetitiveEvent).dayPeriodicity.split('/')[1];
    }

    type Body = {
        eventDate: string;
        id: string;
        title: string;
        message: string;
        start: string;
        time?: string;
    } | {
        eventDate: string;
        id: string;
        title: string;
        message: string;
        time: string;
        dayPeriodicity: string;
        monthPeriodicity: string;
        yearPeriodicity: string;
        dayOfWeekPeriodicity: string;
        weekDayNumber: number;
    }

    function onSave() {
        const eventDate = (event as OneTimeEvent).start ? (event as OneTimeEvent).start + 'T' + event.time.split('T')[1] : (event as OneTimeEvent).start;
        const body: Body = { ...event, eventDate };
        if (body.eventDate !== null && body.eventDate !== undefined) {
            delete body.time;
        }
        axios.post<string>("/api/events", body)
            .then((res) => {
                if (event.id === '') {
                    event.id = res.data;
                    newEvent(event);
                } else {
                    deleteEvent(event.id);
                    newEvent(event);
                }
            });
    }

    function onDelete() {
        axios.delete("/api/events", { data: { id: event.id } })
            .then(() => {
                deleteEvent(event.id);
                onExit();
            });
    }

    if (select.view !== "redactor") {
        return (<Navigate to={"/calendar"} />);
    }
    if (!events) {
        return (<>Unexpected error</>);
    }

    const repeatPeriodForm = isRepetitive && !(event as OneTimeEvent).start ?
        <>
            {
                /\//.test((event as RepetitiveEvent).monthPeriodicity) ?
                    <Form.Check
                        id="isRelatedOnDaysOfWeek"
                        type="checkbox"
                        label={`Is related on days of week`}
                        checked={isRelatedOnDaysOfWeek}
                        onChange={onChangeIsRelatedOnDaysOfWeek}
                    />
                    : null
            }
            <InputGroup>
                <InputGroup.Text>Repeat every</InputGroup.Text>
                <Form.Control
                    id="repeatNumber"
                    type="number"
                    min="1"
                    defaultValue={getRepeatNumber()}
                    onChange={onChangePeriodicity}
                    ref={repeatNumberRef}
                />
                <Form.Select
                    id="repeatPeriod"
                    aria-label="period"
                    defaultValue={getRepeatPeriod(event as RepetitiveEvent).split('-')[0]}
                    onChange={onChangePeriodicity}
                    ref={repeatPeriodRef}
                >
                    <option value="day">day</option>
                    <option value="week">week</option>
                    <option value="month">month</option>
                    <option value="year">year</option>
                </Form.Select>
            </InputGroup>
        </> : null;

    const cancelOrDeleteButton = event.id === '' ?
        <Button
            className='w-100'
            variant='outline-secondary'
            onClick={onExit}
        >
            Cancel
        </Button> :
        <Button
            className='w-100'
            variant='danger'
            onClick={onDelete}
            data-testid="deleteButton"
        >
            Delete
        </Button>;

    return (
        <div>
            <InputGroup className="mb-3">
                <Button onClick={onExit}>←</Button>
                <Form.Control
                    id="title"
                    data-testid="titleInput"
                    as="input"
                    placeholder="Event name"
                    value={event.title}
                    onChange={onChangeTitle}
                />
            </InputGroup>
            <div className="mb-3">
                <Form.Control
                    id="message"
                    as="textarea"
                    rows={2}
                    placeholder="Your message"
                    value={event.message}
                    onChange={onChangeMessage}
                />
            </div>
            <InputGroup className="mb-3">
                <InputGroup.Text id="description">{getDescription()}</InputGroup.Text>
                <Form.Control
                    id="time"
                    type="time"
                    aria-describedby="date"
                    value={format(new Date(event.time), "HH:mm")}
                    onChange={onChangeTime}
                />
            </InputGroup>
            <div className="mb-3">
                <Form.Check
                    id="isRepetitive"
                    type="checkbox"
                    label={`Is repetitive`}
                    checked={isRepetitive}
                    onChange={onChangeIsRepetitive}
                />
                {repeatPeriodForm}
            </div>
            <div className="mb-3">
                <Row>
                    <Col className='gy-1'>
                        <Button
                            className='w-100'
                            onClick={onSave}
                            data-testid="saveButton"
                        >
                            Save
                        </Button>
                    </Col>
                    <Col className='gy-1'>
                        {cancelOrDeleteButton}
                    </Col>
                </Row>
            </div>
        </div>
    )
}
