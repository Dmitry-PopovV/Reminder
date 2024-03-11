import { ValidateIf, IsOptional, IsUUID, Length, IsISO8601, Matches, IsInt, Max, Min } from "class-validator"

const periodicityRegExp = /(^[\*0-9]\/[1-9][0-9]?$)|(^\*$)|(^[1-9][0-9]?$)/;

export class saveEventDto {
    @ValidateIf(dto => dto.id !== '')
    @IsUUID()
    id: string

    @Length(1, 20)
    title: string

    @Length(0, 100)
    message: string

    @IsOptional()
    @IsISO8601()
    eventDate: string

    @IsOptional()
    @IsISO8601()
    time: string

    @IsOptional()
    @Matches(periodicityRegExp)
    dayPeriodicity: string

    @IsOptional()
    @Matches(periodicityRegExp)
    monthPeriodicity: string

    @IsOptional()
    @Matches(periodicityRegExp)
    yearPeriodicity: string

    @IsOptional()
    @Matches(periodicityRegExp)
    dayOfWeekPeriodicity: string
    
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(31)
    weekDayNumber: number
}
