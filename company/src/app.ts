import express from 'express';
import { routes } from "./presentation/handlers"
import dependecies from './infra/config/dependecies'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { errorHandler, NotFoundError } from '@muhammednajinnprosphere/common';


const app = express();
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}))
app.use(cookieParser());
app.use(express.json());
app.use((req, res,  next) => {

    console.log(req.method, req.url);
   
    next();
})

app.use("/api/v1", routes(dependecies));



app.use("*", () => {
    throw new NotFoundError()
})

app.use(errorHandler);

export { app };