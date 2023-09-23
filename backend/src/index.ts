import "reflect-metadata";
import express from 'express';
import serverStart from "./serverStart";


const app = express();
const port = 3000;

serverStart()
  .then(() => {
    app.get('/', async (req, res) => {
      res.send('Hello World!');
    });
    app.listen(port, async () => {
      console.log(`Example app listening on port ${port}`);
    });
  });
