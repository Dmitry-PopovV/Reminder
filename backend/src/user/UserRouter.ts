import { Router } from "express";
import { sendUserController } from "./controllers/sendUserController";

export const UserRouter = Router();

UserRouter
    .get("/", sendUserController);
