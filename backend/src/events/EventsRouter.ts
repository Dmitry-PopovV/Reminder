import { Router } from "express";
import { ValidationMidleware } from "../midleware/ValidationMidleware";
import { getEventsDto } from "./dto/getEventsDto";
import { getEventsController } from "./controllers/getEventsController";

export const EventsRouter = Router();

EventsRouter
    .get("/events", [ValidationMidleware("query", getEventsDto), getEventsController])
