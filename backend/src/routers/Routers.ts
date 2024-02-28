import { Router } from "express";
import { AuthRouter } from "../auth/AuthRouter";
import { AuthorizationMidleware } from "../midleware/AuthorizationMidleware";
import { UserRouter } from "../user/UserRouter";
import { EventsRouter } from "../events/EventsRouter";

const Routers = Router();

Routers
    .use("/auth", AuthRouter)
    .use("/", AuthorizationMidleware)
    .use("/user", UserRouter)
    .use("/events", EventsRouter);

export default Routers;
