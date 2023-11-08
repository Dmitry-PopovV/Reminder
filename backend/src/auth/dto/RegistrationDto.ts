import { Length } from 'class-validator';

export class RegistrationDto {
    @Length(73, 73)
    code: string
}
