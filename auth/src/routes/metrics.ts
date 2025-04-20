import express from "express";
import { collectDefaultMetrics, Registry } from "prom-client";

// Create a Registry and collect default metrics
const register = new Registry();
collectDefaultMetrics({ register });

const router = express.Router();

router.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

export { router as metricsRouter, register };
