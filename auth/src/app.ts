import express, { Request, Response} from 'express';
import { routes } from "@presentation/routes"
import dependecies from '@infra/config/dependencies'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { errorHandler, NotFoundError } from '@muhammednajinnprosphere/common';
import { createServer } from 'http';


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


app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        message: 'Service is running successfully',
    });
});

app.use("/api/v1", routes(dependecies));



app.use("*", (req: Request, res: Response) => {
    throw new NotFoundError()
})

app.use(errorHandler);

export { app };