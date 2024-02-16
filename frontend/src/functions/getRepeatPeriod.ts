import { RepetitiveEvent } from '../store/slicers/eventsSlice';

export default function getRepeatPeriod(event: RepetitiveEvent) {
    if (event.yearPeriodicity.match(/^.\/.$/)) {
        return "year";
    }
    if (event.monthPeriodicity.match(/^.\/.$/)) {
        if(event.dayPeriodicity === '*') {
            return "month-weekday";
        } else {
            return "month-date";
        }
    }
    if (event.dayOfWeekPeriodicity.match(/^.\/.$/)) {
        return "week";
    }
    return "day";
}
