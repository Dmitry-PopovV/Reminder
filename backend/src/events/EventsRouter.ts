import { Router } from "express";
import { ValidationMidleware } from "../midleware/ValidationMidleware";
import { getEventsDto } from "./dto/getEventsDto";
import { getEventsController } from "./controllers/getEventsController";
import { saveEventDto } from "./dto/saveEventDto";
import { saveEventController } from "./controllers/saveEventController";
import { deleteEventDto } from "./dto/deleteEventDto";
import { deleteEventController } from "./controllers/deleteEventController";

export const EventsRouter = Router();

EventsRouter
    .get("/", [ValidationMidleware("query", getEventsDto), getEventsController])
    .post("/", [ValidationMidleware("body", saveEventDto), saveEventController])
    .delete("/", [ValidationMidleware("body", deleteEventDto), deleteEventController]);
