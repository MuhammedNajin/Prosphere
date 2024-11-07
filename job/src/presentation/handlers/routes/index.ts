import express, { Request, Response, Express } from "express";
import { JobRoutes } from './jobRoutes'
import { ApplicationRoutes } from "./applicationRoutes";

export class AppRoutes {
    private readonly dependencies: null;

    constructor(dependencies: any) {
        this.dependencies = dependencies;
    }

    get routes() {
        const router = express.Router();
        const  { applicationUseCase, jobUseCase } = this.dependencies.useCase;
        console.log("job usecase", this.dependencies.useCase);
        
        const applicationRoutes = new ApplicationRoutes(applicationUseCase).router
        router.use('/job/application', applicationRoutes);
        
        const jobRoutes = new JobRoutes(jobUseCase).router;
        router.use('/job', jobRoutes)


        // test route 
        router.get('/', (req: Request, res: Response) => {
            res.status(200).send({ message: 'Server is running'});
        })
       
        return router;
    }
}