import { Router } from "express";
import { RegistrationController } from "../controllers/RegistrationController";

const ApiRouter = Router();

ApiRouter
  .post("/registration", RegistrationController);

export default ApiRouter;
