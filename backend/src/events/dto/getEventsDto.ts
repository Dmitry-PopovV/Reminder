import { IsISO8601 } from "class-validator"

export class getEventsDto {
    @IsISO8601({}, {
        each: true,
    })
    months: string[]
}
