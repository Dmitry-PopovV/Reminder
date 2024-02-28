import { Router } from "express";
import { getUserController } from "./controllers/getUserController";

export const UserRouter = Router();

UserRouter
    .get("/", getUserController);
