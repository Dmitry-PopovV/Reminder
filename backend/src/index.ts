import "reflect-metadata";
import express, { Request, Response, NextFunction } from 'express';
import serverStart from "./serverStart";
import ErrorMidleware from "./midleware/ErrorMidleware";


const app = express();
const port = 3000;

async function main() {
  try {
    await serverStart();

    app
      .get('/', (req, res, next) => {
        throw new Error("AAA");
        res.send('Hello World!');
      })
      .use(ErrorMidleware);
    app
      .listen(port, () => {
        console.log(`Example app listening on port ${port}`);
      });
  } catch (err) {
    console.log("Fatal error:\n", err);
  }
}
main();
