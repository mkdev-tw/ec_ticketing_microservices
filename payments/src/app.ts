import express from "express";
import 'express-async-errors';
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@mkvalidate/common";
import { createChargeRouter } from "./routes/new";


const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false, //disable encrypt
    secure: process.env.NODE_ENV !== 'test'  //only send cookie over https
  })
);

app.use(currentUser);

app.use(createChargeRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
})

app.use(errorHandler);

export { app };