import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { BadRequestError, validateRequest } from "@mkvalidate/common";
import { Counter } from "prom-client";
import { User } from "../models/user";
import { register } from "./metrics";

const router = express.Router();

const signupCounter = new Counter({
  name: 'auth_signup_total',
  help: 'Total number of user signup',
  registers: [register],
});

router.post('/api/users/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Email is not valid'),
    body('password')
      .trim()
      .isLength({ min: 5, max: 20 })
      .withMessage('Password must be between 5 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email is already in use');
    }

    const user = User.build({ email, password });
    await user.save();

    // generate JWT
    const userJwt = jwt.sign({
      id: user.id,
      email: user.email,
    },
      process.env.JWT_KEY!
    );

    // store on session object
    req.session = {
      jwt: userJwt,
    };

    // Log the signup successful message
    console.log('Signup successful — incrementing counter');

    // Increment the signup counter
    signupCounter.inc();

    res.status(201).send(user);
  });

export { router as signupRouter };

