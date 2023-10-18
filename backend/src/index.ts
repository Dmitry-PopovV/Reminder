import "reflect-metadata";
import "./types/session";
import express from 'express';
import session from 'express-session';
import serverStart from "./serverStart";
import ErrorMidleware from "./midleware/ErrorMidleware";
import Routers from "./routers/Routers";


const app = express();
const port = 3000;

async function main() {
  try {
    const cookieSecret = await serverStart();

    app
      .use(express.json())
      .use(session({ secret: cookieSecret, cookie: { maxAge: 86400000 }, resave: false, saveUninitialized: true}))
      .get('/', (req, res) => {
        res.send('Hello World!');
      })
      .use("/api", Routers)
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
