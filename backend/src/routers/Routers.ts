import { Router } from "express";
import { AuthRouter } from "../auth/AuthRouter";
import { AuthenticationMidleware } from "../auth/midleware/AuthenticationMidleware";
import { GetInfoRouter } from "../getInfo/GetInfoRouter";

const Routers = Router();

Routers
  .use("/", AuthRouter)
  .use("/", AuthenticationMidleware)
  .use("/", GetInfoRouter);

export default Routers;
