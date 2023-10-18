import { Router } from "express";
import { UserController } from "./controllers/UserController";

export const GetInfoRouter = Router();

GetInfoRouter
  .get("/user", UserController);

