import { json } from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import 'express-async-errors';

import { errorHandler, NotFoundError } from "@mkvalidate/common";
import { currentUserRouter } from "./routes/current-user";
import { metricsRouter } from "./routes/metrics";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false, //disable encrypt
    secure: process.env.NODE_ENV !== 'test'  //only send cookie over https
  })
)

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(metricsRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
})

app.use(errorHandler);

export { app };

