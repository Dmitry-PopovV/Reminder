import { IsISO8601 } from "class-validator"

export class sendEventsParams {
    @IsISO8601({}, {
        each: true,
    })
    months: string[]
}
