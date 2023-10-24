import { Request, Response } from "express";
import { validateOrReject, ValidationError } from 'class-validator';

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
            const errs = (errors as ValidationError[]);
            next(new Error("ValidationError: " + errs[0].property + " = " + errs[0].value));
        }
    }
}
