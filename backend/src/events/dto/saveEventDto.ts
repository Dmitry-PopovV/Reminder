import { ValidateIf, IsUUID, Length, IsISO8601, Matches, IsInt, Max, Min } from "class-validator"

const periodicityRegExp = /(^[\*0-9]\/[1-9][0-9]?$)|(^\*$)|(^[1-9][0-9]?$)/;

export class saveEventDto {
    @ValidateIf(dto => dto.id !== '')
    @IsUUID()
    id: string

    @Length(1, 20)
    title: string

    @Length(0, 100)
    message: string

    @ValidateIf(dto => dto.eventDate !== undefined)
    @IsISO8601()
    eventDate: string

    @ValidateIf(dto => dto.time !== undefined)
    @IsISO8601()
    time: string

    @ValidateIf(dto => dto.dayPeriodicity !== undefined)
    @Matches(periodicityRegExp)
    dayPeriodicity: string

    @ValidateIf(dto => dto.monthPeriodicity !== undefined)
    @Matches(periodicityRegExp)
    monthPeriodicity: string

    @ValidateIf(dto => dto.yearPeriodicity !== undefined)
    @Matches(periodicityRegExp)
    yearPeriodicity: string

    @ValidateIf(dto => dto.dayOfWeekPeriodicity !== undefined)
    @Matches(periodicityRegExp)
    dayOfWeekPeriodicity: string
    
    @ValidateIf(dto => dto.weekDayNumber !== undefined)
    @IsInt()
    @Min(0)
    @Max(31)
    weekDayNumber: number
}
