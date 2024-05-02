import { useState, useMemo } from "react";
import { AllEvents, OneTimeEvent, RepetitiveEvent } from "../../store/slicers/eventsSlice";
import { Select } from "../Layout/Layout";
import getRepeatPeriod from '../../functions/getRepeatPeriod';
import parse from "date-fns/parse";


function setup(events: AllEvents | undefined | null, select: Select) {
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

        selectedEvent = events.repetitiveEvents.find((el: RepetitiveEvent) => {
            return select.eventID ? el.id === select.eventID.split("@")[0] : false
        });
        if (!selectedEvent) {
            const splitedDate = select.date.split('-');
            const month = `${splitedDate[0]}-${splitedDate[1]}`;
            if (events.oneTimeEvents[month]) {
                selectedEvent = events.oneTimeEvents[month].find((el: OneTimeEvent) => el.id === select.eventID);
            }
        } else {
            defaultIsRepetitive = true;
            if (getRepeatPeriod(selectedEvent) === "month-weekday") {
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

export default function useSetup(events: AllEvents | undefined | null, select: Select) {
    const { defaultIsRepetitive, defaultEvent, defaultIsRelatedOnDaysOfWeek } = useMemo(() => setup(events, select), [select]);

    const isRepetitiveState = useState(defaultIsRepetitive);
    const isRelatedOnDaysOfWeekState = useState(defaultIsRelatedOnDaysOfWeek);
    const eventState = useState<OneTimeEvent | RepetitiveEvent>(defaultEvent);

    return { isRepetitiveState, isRelatedOnDaysOfWeekState, eventState };
}
