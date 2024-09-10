import express from 'express';
import { routes } from "./routes"
import dependecies from './config/dependencies'
import cors from 'cors'
import cookieParser from 'cookie-parser'


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



export { app };