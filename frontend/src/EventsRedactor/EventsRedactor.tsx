import { useRef, useState } from 'react';
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
import parse from 'date-fns/parse';
import { Select } from "../types/Select";
import { useEvents } from '../hooks/useEvents';
import { OneTimeEvent, RepetitiveEvent } from '../store/slicers/eventsSlice';
import getRepeatPeriod from '../functions/getRepeatPeriod';

export default function EventsRedactor() {
    const [select, setSelect] = useOutletContext<[Select, (param: Select) => void]>();
    return <Redactor select={select} setSelect={setSelect} key={select.eventID} />
}

function Redactor({ select, setSelect }: { select: Select, setSelect: (param: Select) => void }) {
    const { events, newEvent, deleteEvent } = useEvents();

    function setup() {
        const placeholderEvent = {
            id: "",
            title: "_placeholderEvent",
            message: "",
            start: "",
            time: ""
        }

        let defaultIsRepetitive = false;
        let defaultIsRelatedOnDaysOfWeek: boolean = false;
        let selectedEvent: OneTimeEvent | RepetitiveEvent | undefined;
        if (events && select.view === "redactor" && select.isNew) {

            selectedEvent = events.repetitiveEvents.find((el: RepetitiveEvent) => { return select.eventID ? el.id === select.eventID.split("@")[0] : false });
            if (!selectedEvent) {
                const splitedDate = select.date.split('-');
                const month = `${splitedDate[0]}-${splitedDate[1]}`;
                if (events.oneTimeEvents[month]) {
                    selectedEvent = events.oneTimeEvents[month].find((el: OneTimeEvent) => el.id === select.eventID);
                }
            } else {
                defaultIsRepetitive = true;
                if(getRepeatPeriod(selectedEvent) === "month-weekday") {
                    defaultIsRelatedOnDaysOfWeek = true;
                }
            }
            if (!selectedEvent) {
                selectedEvent = {
                    id: "",
                    title: "New event",
                    message: "",
                    start: select.date,
                    time: parse(select.date!, "y-M-d", new Date()).toISOString()
                }
            }
        }

        

        return { defaultIsRepetitive, defaultEvent: selectedEvent ? selectedEvent : placeholderEvent, defaultIsRelatedOnDaysOfWeek };
    }
    const { defaultIsRepetitive, defaultEvent, defaultIsRelatedOnDaysOfWeek } = setup();

    const [isRepetitive, setIsRepetitive] = useState(defaultIsRepetitive);
    const [isRelatedOnDaysOfWeek, setIsRelatedOnDaysOfWeek] = useState(defaultIsRelatedOnDaysOfWeek);
    const [event, setEvent] = useState<OneTimeEvent | RepetitiveEvent>(defaultEvent);

    const repeatNumberRef = useRef<HTMLInputElement>(null);
    const repeatPeriodRef = useRef<HTMLSelectElement>(null);


    function onExitClick() {
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

        function setPeriodicity(newVal: RepetitiveEvent, dayPeriodicity: string, monthPeriodicity: string, yearPeriodicity: string, dayOfWeekPeriodicity: string, weekDayNumber: number) {
            newVal.dayPeriodicity = dayPeriodicity;
            newVal.monthPeriodicity = monthPeriodicity;
            newVal.yearPeriodicity = yearPeriodicity;
            newVal.dayOfWeekPeriodicity = dayOfWeekPeriodicity;
            newVal.weekDayNumber = weekDayNumber;
        }

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
                setPeriodicity(newVal, "*/" + repeatNumber, "*", "*", "*", 0);
                break;
            case "week":
                setPeriodicity(newVal, "*", "*", "*", getDay(new Date(newVal.time)) + "/" + repeatNumber, 0);
                break;
            case "month":
                if (isRelatedOnDaysOfWeek) {
                    setPeriodicity(newVal, "*", "*/" + repeatNumber, "*", '' + getDay(new Date(newVal.time)), getWeekDayNumber(new Date(newVal.time)));
                } else {
                    setPeriodicity(newVal, '' + getDate(new Date(newVal.time)), "*/" + repeatNumber, "*", "*", 0);
                }
                break;
            case "year":
                setPeriodicity(newVal, '' + getDate(new Date(newVal.time)), '' + getMonth(new Date(newVal.time)), "*/" + repeatNumber, "*", 0);
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
        if(num < 4 || num > 20) {
            const lastDigit = num % 10;
            switch(lastDigit) {
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
            switch (repeatPeriodRef.current ? repeatPeriodRef.current.value : getRepeatPeriod(event as RepetitiveEvent).split('-')[0]) {
                case "day":
                    return `Every ${Number((event as RepetitiveEvent).dayPeriodicity.split('/')[1])} day(s)`;
                case "week":
                    return `Every ${(event as RepetitiveEvent).dayOfWeekPeriodicity.split('/')[1]} week on ${daysOfWeek[Number((event as RepetitiveEvent).dayOfWeekPeriodicity.split('/')[0])]}`;
                case "month":
                    if (isRelatedOnDaysOfWeek) {
                        return `Every ${(event as RepetitiveEvent).monthPeriodicity.split('/')[1]} month on ${toOrdinal((event as RepetitiveEvent).weekDayNumber)} ${daysOfWeek[Number((event as RepetitiveEvent).dayOfWeekPeriodicity)]}`;
                    } else {
                        return `Every ${(event as RepetitiveEvent).monthPeriodicity.split('/')[1]} month on ${toOrdinal(getDate(new Date(event.time)))}`;
                    }
                case "year":
                    return `Every ${(event as RepetitiveEvent).yearPeriodicity.split('/')[1]} year on ${toOrdinal(getDate(new Date(event.time)))} of ${months[getMonth(new Date(event.time))]}`;
            }
        } else {
            return `On ${event.time.split('T')[0]}`;
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

    function onSave() {
        console.log(event);
    }

    if (select.view !== "redactor") {
        return (<Navigate to={"/calendar"} />);
    } else if (!events) {
        return (<>Unexpected error</>);
    } else {
        return (
            <div>
                <InputGroup className="mb-3">
                    <Button onClick={onExitClick}>←</Button>
                    <Form.Control id="title" as="input" placeholder="Event name" value={event.title} onChange={onChangeTitle} />
                </InputGroup>
                <div className="mb-3">
                    <Form.Control id="message" as="textarea" rows={2} placeholder="Your message" value={event.message} onChange={onChangeMessage} />
                </div>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="description">{getDescription()}</InputGroup.Text>
                    <Form.Control id="time" type="time" aria-describedby="date" value={format(new Date(event.time), "HH:mm")} onChange={onChangeTime} />{/*<------*/}
                </InputGroup>
                <div className="mb-3">
                    <Form.Check id="isRepetitive" type="checkbox" label={`Is repetitive`} checked={isRepetitive} onChange={onChangeIsRepetitive} />
                    {
                        isRepetitive && !(event as OneTimeEvent).start ? <>
                            {/\//.test((event as RepetitiveEvent).monthPeriodicity) ? <Form.Check id="isRelatedOnDaysOfWeek" type="checkbox" label={`Is related on days of week`} checked={isRelatedOnDaysOfWeek} onChange={onChangeIsRelatedOnDaysOfWeek} /> : <></>}
                            <InputGroup>
                                <InputGroup.Text>Repeat every</InputGroup.Text>
                                <Form.Control id="repeatNumber" type="number" min="1" defaultValue={getRepeatNumber()} onChange={onChangePeriodicity} ref={repeatNumberRef} />
                                <Form.Select id="repeatPeriod" aria-label="period" defaultValue={getRepeatPeriod(event as RepetitiveEvent).split('-')[0]} onChange={onChangePeriodicity} ref={repeatPeriodRef}>
                                    <option value="day">day</option>
                                    <option value="week">week</option>
                                    <option value="month">month</option>
                                    <option value="year">year</option>
                                </Form.Select>
                            </InputGroup>
                        </> : <></>
                    }
                </div>
                <div className="mb-3">
                    <div>
                        <Button className='w-100' onClick={onSave}>Save</Button>
                    </div>
                    <Row>
                        <Col className='gy-1'><Button className='w-100'>Test send</Button></Col>
                        <Col className='gy-1'><Button className='w-100' variant='danger'>Delete</Button></Col>
                    </Row>
                </div>
            </div>
        )
    }
}
