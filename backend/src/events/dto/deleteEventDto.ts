import { IsUUID } from "class-validator";

export class deleteEventDto {
    @IsUUID()
    id: string
}