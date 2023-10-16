import { Router } from "express";
import { RegistrationController } from "./controllers/RegistrationController";
import { ValidationMidleware } from "./midleware/ValidationMidleware";
import { RegistrationParams } from "./dto/RegistrationParams";

export const AuthRouter = Router();

AuthRouter
  .post("/registration", [ValidationMidleware(RegistrationParams), RegistrationController]);

