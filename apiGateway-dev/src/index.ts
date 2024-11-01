import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { setupAuth } from "./auth/auth";
import { ROUTES } from "./routes/routes";
import { setupProxies } from "./proxy/proxy";
import { errorHandler } from '@muhammednajinnprosphere/common'
import loggerMiddleware from './logger/morgan'
dotenv.config();

const app = express();
const port = 6002;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());

// app.use((req,_, next) => {
//    console.log(req.url, req.method);
//    next();
// })

app.use(loggerMiddleware);



setupAuth(app, ROUTES);
setupProxies(app, ROUTES);

app.use(errorHandler)
app.listen(port, () => {
  console.log(`API-Gateway running at http://localhost:${port}`);
});
