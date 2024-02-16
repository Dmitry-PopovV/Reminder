import { Router } from "express";
import { AuthRouter } from "../auth/AuthRouter";
import { AuthorizationMidleware } from "../midleware/AuthorizationMidleware";
import { UserRouter } from "../user/UserRouter";
import { EventsRouter } from "../events/EventsRouter";

const Routers = Router();

Routers
    .use("/", AuthRouter)
    .use("/", AuthorizationMidleware)
    .use("/", UserRouter)
    .use("/", EventsRouter);

export default Routers;
