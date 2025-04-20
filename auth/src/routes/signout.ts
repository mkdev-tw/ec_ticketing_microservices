import express from "express";
import { Counter } from "prom-client";
import { register } from "./metrics";

const router = express.Router();

const logoutCounter = new Counter({
  name: 'auth_signout_total',
  help: 'Total number of user logout attempts',
  registers: [register],
});

router.post('/api/users/signout', (req, res) => {
  req.session = null;

  // Increment the signout counter
  logoutCounter.inc();

  // Log the signout successful message
  console.log('Signout successful — incrementing counter');

  res.send({});
});

export { router as signoutRouter };

