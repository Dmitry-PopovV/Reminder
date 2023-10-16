import { Length } from 'class-validator';

export class RegistrationParams {
    @Length(73, 73)
    code: string
}
