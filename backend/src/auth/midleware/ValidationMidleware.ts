import { Request, Response } from "express";
import { validateOrReject } from 'class-validator';

export function ValidationMidleware(dto: new () => any) {
    return async (req: Request, res: Response, next: Function) => {
        try {
            const newDto = new dto;
            const properties = Object.keys(req.body);
            properties.forEach((val) => {
                newDto[val] = req.body[val];
            })
            await validateOrReject(newDto);
            next();
        } catch(errors: any) {
            next(new Error("ValidationError: " + errors[0].property + " = " + errors[0].value));
        }
    }
}
