import { Router } from "express";
import { RegistrationController } from "./controllers/RegistrationController";
import { logoutController } from "./controllers/logoutController";
import { ValidationMidleware } from "../midleware/ValidationMidleware";
import { RegistrationDto } from "./dto/RegistrationDto";

export const AuthRouter = Router();

AuthRouter
  .post("/registration", [ValidationMidleware("body", RegistrationDto), RegistrationController])
  .put("/logout", logoutController);

