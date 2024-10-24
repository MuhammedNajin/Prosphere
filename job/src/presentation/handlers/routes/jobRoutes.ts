import { Router } from "express";
import { JobController } from '../controller/'
import JobUseCase from '@application/interface/jobUsecase_interface'
export class JobRoutes {
  
    private jobUseCase;

    constructor(jobUseCase: JobUseCase) {
      this.jobUseCase = jobUseCase;
    }

    get router() {

        const router = Router();
        console.log("job routes", this.jobUseCase)
        const { jobPostUseCase, getJobsUseCase } = this.jobUseCase;
        router
         .route('/')
         .post(JobController.jobPost(jobPostUseCase))
         .get(JobController.getJobs(getJobsUseCase))

        router
         .route('/:id')
         .get(JobController.getJobs(getJobsUseCase));
        return router;

    }
}