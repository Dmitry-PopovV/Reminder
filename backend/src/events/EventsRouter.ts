import { Router } from "express";
import { ValidationMidleware } from "../midleware/ValidationMidleware";
import { sendEventsParams } from "./dto/sendEventsParams";
import { sendEventsController } from "./controllers/sendEventsController";

export const EventsRouter = Router();

EventsRouter
    .post("/events", [ValidationMidleware(sendEventsParams), sendEventsController])