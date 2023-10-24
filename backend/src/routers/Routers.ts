import { Router } from "express";
import { AuthRouter } from "../auth/AuthRouter";
import { AuthorizationMidleware } from "../midleware/AuthorizationMidleware";
import { UserRouter } from "../user/UserRouter";

const Routers = Router();

Routers
  .use("/", AuthRouter)
  .use("/", AuthorizationMidleware)
  .use("/", UserRouter);

export default Routers;
