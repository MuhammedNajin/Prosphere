import { BaseUrl } from "../constants/BaseURl"
import { customLogger } from "../logger/morgan"
import express, { Express, Request } from "express"
import { authRoutes } from "./authService";
import { rateLimit } from 'express-rate-limit'
import { RateLimitConfig } from "../type/interface";

const app = express();

function applyRateLimiters(routes: RateLimitConfig[]) {
    routes.forEach((routeConfig) => {
      const { path, limit, windowMs } = routeConfig;
      const rateLimiter = rateLimit({
        windowMs: windowMs || 5 * 60 * 1000, 
        max: limit || 10,
        standardHeaders: true,
        legacyHeaders: false,
      });
      app.use(path, rateLimiter);
    });
  }

  applyRateLimiters(authRoutes);


  export default app;
