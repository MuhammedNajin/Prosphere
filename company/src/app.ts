import express from 'express';
import { routes } from "./presentation/handlers"
import dependecies from './infra/config/dependecies'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { errorHandler, NotFoundError } from '@muhammednajinnprosphere/common';


const app = express();
const dev_domain = process.env.DEV_FRONTEND_DOMAIN;
const prod_domain = process.env.PROD_FRONTEND_DOMAIN;
app.use(
  cors({
    origin:[ dev_domain!, prod_domain! ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use((req, res,  next) => {

    console.log(req.method, req.url);
   
    next();
})

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        message: 'Service is running successfully',
    });
});

app.use("/api/v1", routes(dependecies));



app.use("*", () => {
    throw new NotFoundError()
})

app.use(errorHandler);

export { app };