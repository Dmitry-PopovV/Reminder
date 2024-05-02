import { RepetitiveEvent } from '../store/slicers/eventsSlice';
import getRepeatPeriod from "./getRepeatPeriod";

const day: RepetitiveEvent = {
    id: "123e4567-e89b-12d3-a456-426655440000",
    title: "test",
    message: "test",
    time: "2024-10-05T01:00:00.000Z",
    dayPeriodicity: "*/1",
    dayOfWeekPeriodicity: "*",
    monthPeriodicity: "*",
    yearPeriodicity: "*",
    weekDayNumber: 0
};

const week: RepetitiveEvent = {
    id: "123e4567-e89b-12d3-a456-426655440000",
    title: "test",
    message: "test",
    time: "2024-10-05T01:00:00.000Z",
    dayPeriodicity: "*",
    dayOfWeekPeriodicity: "2/1",
    monthPeriodicity: "*",
    yearPeriodicity: "*",
    weekDayNumber: 0
};

const monthDate: RepetitiveEvent = {
    id: "123e4567-e89b-12d3-a456-426655440000",
    title: "test",
    message: "test",
    time: "2024-10-05T01:00:00.000Z",
    dayPeriodicity: "16",
    dayOfWeekPeriodicity: "*",
    monthPeriodicity: "*/1",
    yearPeriodicity: "*",
    weekDayNumber: 0
};

const monthWeekday: RepetitiveEvent = {
    id: "123e4567-e89b-12d3-a456-426655440000",
    title: "test",
    message: "test",
    time: "2024-10-05T01:00:00.000Z",
    dayPeriodicity: "*",
    dayOfWeekPeriodicity: "2",
    monthPeriodicity: "*/1",
    yearPeriodicity: "*",
    weekDayNumber: 3
};

const year: RepetitiveEvent = {
    id: "123e4567-e89b-12d3-a456-426655440000",
    title: "test",
    message: "test",
    time: "2024-10-05T01:00:00.000Z",
    dayPeriodicity: "16",
    dayOfWeekPeriodicity: "*",
    monthPeriodicity: "3",
    yearPeriodicity: "*/1",
    weekDayNumber: 0
};

describe("getRepeatPeriod", ()=>{
    test("day", ()=>{
        expect(getRepeatPeriod(day)).toBe("day");
    });
    test("week", ()=>{
        expect(getRepeatPeriod(week)).toBe("week");
    });
    test("month-date", ()=>{
        expect(getRepeatPeriod(monthDate)).toBe("month-date");
    });
    test("month-weekday", ()=>{
        expect(getRepeatPeriod(monthWeekday)).toBe("month-weekday");
    });
    test("year", ()=>{
        expect(getRepeatPeriod(year)).toBe("year");
    });
})
