 import express from 'express';
 import { AppRoutes } from '@presentation/handlers/routes'
 import cors from 'cors';

 class App {
    private readonly app: express.Application;
    private readonly dependencies;

    constructor(dependencies: any) {
        this.dependencies = dependencies;
        this.app = express();
        this.config()
        this.registerRoutes()
        this.startServer()
      
    }

    private config() {
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
        this.app.use(cors({
           origin: ["http://localhost:5173"],
           credentials: true
        }));

        this.app.use((req, res, next) => {
            console.log(req.url, req.method, req.body);
             next() 
        }) 
    }

    private registerRoutes(): void {
        

        console.log("dep", this.dependencies);
        const appRoute = new AppRoutes(this.dependencies)
        this.app.use("/api/v1", appRoute.routes)
    }

    private startServer(): void {
        const PORT: number = 5000;
        this.app.listen(process.env.PORT || PORT, () => {
            console.log(`Job service is running at ${PORT}`);
        })
    }
 }

export { App };