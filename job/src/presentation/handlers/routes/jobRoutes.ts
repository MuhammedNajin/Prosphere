import { Router } from "express";
import { CompanyController, JobController } from "../controller/";
import JobUseCase from "@application/interface/jobUsecase_interface";
import { currentCompany } from "@muhammednajinnprosphere/common";
import { Job } from "@/infra/database/mongo";
import { GrpcPaymentClient } from "@/infra/rpc/grpc/grpcPaymentClient";
import { Dependency } from "@/infra/config/dependencies";
import CompanyUseCases from "@/application/interface/companyUsecase_interface.ts";
export class JobRoutes {
  constructor(private jobUseCase: JobUseCase, private companyUseCases: CompanyUseCases) {}

  get router() {
    const router = Router();
  
    const {
      jobPostUseCase,
      getJobsUseCase,
      updateJobUseCase,
      addCommentUseCase,
      likeJobUseCase,
      getCommentUseCase,
      getJobDetailsUseCase,
      jobSeenUseCase,
    } = this.jobUseCase;


    const {
      getAllJobByCompanyIdUseCase,
    } = this.companyUseCases;
    router.use((req, res, next) => {
      console.log("job route hellos i am herer", req.url, req.method);
      next();
    });

    router.get(
      "/all",
      CompanyController.getAllJob(getAllJobByCompanyIdUseCase)
    );

    
    router.route("/public").get(JobController.getJobs(getJobsUseCase));
    
    router
      .route("/:id")
      .get(JobController.getJobDetails(getJobDetailsUseCase))
      .post(JobController.updateJob(updateJobUseCase));

    router
      .route("/comment")
      .post(JobController.addComment(addCommentUseCase))
      .get(JobController.getComment(getCommentUseCase));

    router.route("/like").post(JobController.likeJob(likeJobUseCase));


    router.patch('/view/:id', JobController.jobSeen(jobSeenUseCase));

    

    // router
    //  .route('/all/:id')
    //  .get(JobController.getJobs(getJobsUseCase))

    return router;
  }
}
