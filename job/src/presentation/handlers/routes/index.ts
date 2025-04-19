import express, { Request, Response, Express } from "express";
import { JobRoutes } from './jobRoutes'
import { ApplicationRoutes } from "./applicationRoutes";
import { CompanyRoutes } from "./companyRoutes";
import { Dependency } from "@/infra/config/dependencies";
import { AdminRoutes } from "./adminRoutes";
export class AppRoutes {
    private readonly dependencies: Dependency;

    constructor(dependencies: Dependency) {
        this.dependencies = dependencies;
    }

    get routes() {
        const router = express.Router();
        const  { applicationUseCase, jobUseCase, companyUseCases, adminUseCase } = this.dependencies.useCase;
        const  { notificationProducer, updateTrailProducer } = this.dependencies.messageBroker
 
        console.log("adminUseCasffffffffffffffffffffffffffffffffffffffffffffffffffe", adminUseCase);
        
        const comapayRoutes = new CompanyRoutes(
             applicationUseCase,
             companyUseCases,
             jobUseCase, 
             notificationProducer,
             updateTrailProducer
            ).router
        router.use('/job/company', comapayRoutes);

        const applicationRoutes = new ApplicationRoutes(applicationUseCase, notificationProducer).router
        router.use('/job/application', applicationRoutes);
        
        const adminRoutes = new AdminRoutes(adminUseCase).router
        router.use('/job/admin/', adminRoutes)

        const jobRoutes = new JobRoutes(jobUseCase, companyUseCases).router;
        router.use('/job', jobRoutes)
        
        // test route 
        router.get('/', (req: Request, res: Response) => {
            res.status(200).send({ message: 'Server is running'});
        })
       
        return router;
    }
}