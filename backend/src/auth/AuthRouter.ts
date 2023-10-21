import { Router } from "express";
import { RegistrationController } from "./controllers/RegistrationController";
import { logOutController as logOutController } from "./controllers/logOutController";
import { ValidationMidleware } from "../midleware/ValidationMidleware";
import { RegistrationParams } from "./dto/RegistrationParams";

export const AuthRouter = Router();

AuthRouter
  .post("/registration", [ValidationMidleware(RegistrationParams), RegistrationController])
  .get("/logOut", logOutController);

