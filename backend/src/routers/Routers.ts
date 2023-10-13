import { Router } from "express";
import { AuthRouter } from "../auth/AuthRouter";

const Routers = Router();

Routers
  .use("/", AuthRouter);

export default Routers;
