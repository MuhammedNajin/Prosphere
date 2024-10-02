import { Router } from "express";
import { JobController } from '../controller/'

export class JobRoutes {
  
    private jobUseCase;

    constructor(jobUseCase) {
      this.jobUseCase = jobUseCase;
    }

    get router() {
        const router = Router();
        console.log("job routes", this.jobUseCase)
        const { jobPostUseCase } = this.jobUseCase;
        router
         .route('/')
         .post(JobController.jobPost(jobPostUseCase))
        return router;
    }
}