import { Router } from "express";
import { JobController } from '../controller/'
import JobUseCase from '@application/interface/jobUsecase_interface'
export class JobRoutes {


    constructor( private jobUseCase: JobUseCase) {}

    get router() {

        const router = Router();
        console.log("job routes", this.jobUseCase)
        const { jobPostUseCase, getJobsUseCase, updateJobUseCase, addCommentUseCase } = this.jobUseCase;
        router.use((req, res, next) => {
          console.log("application route", req.url, req.method)
          next()
        })

        router
        .route('/comment')
        .post(JobController.addComment(addCommentUseCase));


        router
         .route('/')
         .post(JobController.jobPost(jobPostUseCase))
         .get(JobController.getJobs(getJobsUseCase))

        router
         .route('/:id')
         .get(JobController.getJobs(getJobsUseCase))
         .post(JobController.updateJob(updateJobUseCase));

       
        return router;

    }
}