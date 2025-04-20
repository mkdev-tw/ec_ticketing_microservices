import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { BadRequestError, validateRequest } from "@mkvalidate/common";
import { Counter } from "prom-client";
import { User } from "../models/user";
import { Password } from "../services/password";
import { register } from "./metrics";

const router = express.Router();

const loginCounter = new Counter({
  name: 'auth_signin_total',
  help: 'Total number of user login attempts',
  registers: [register],
});

router.post('/api/users/signin',
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {


    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordMatch = await Password.compare(existingUser.password, password);
    if (!passwordMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    // generate JWT
    const userJwt = jwt.sign({
      id: existingUser.id,
      email: existingUser.email,
    },
      process.env.JWT_KEY!
    );

    // store on session object
    req.session = {
      jwt: userJwt,
    };

    // Log the login successful message
    console.log('Login successful — incrementing counter');

    // Increment the login counter
    loginCounter.inc();

    res.status(200).send(existingUser);
  });

export { router as signinRouter };

