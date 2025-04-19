import { Router } from "express";
import {
  ApplicationController,
  CompanyController,
  JobController,
} from "../controller";
import ApplicationUseCase from "@application/interface/applicationUsecase_interface.ts";
import CompanyUseCases from "@/application/interface/companyUsecase_interface.ts";
import {
  validateRequestBody,
  CreateApplicationSchema,
} from "@muhammednajinnprosphere/common";
import JobUseCase from "@/application/interface/jobUsecase_interface";
import { Dependency } from "@/infra/config/dependencies";
import { TrailLimitMiddleware } from "@/presentation/middleware/subscriptionWrapper";

export class CompanyRoutes {
  constructor(
    private applicationUseCases: ApplicationUseCase,
    private companyUseCases: CompanyUseCases,
    private jobUseCase: JobUseCase,
    private notificationProducer: Dependency["messageBroker"]["notificationProducer"],
    private updateTrailProducer: Dependency["messageBroker"]["updateTrailProducer"]
  ) {}

  get router() {
    const router = Router();
    const {
      getAllApplicationUseCase,
      changeApplicationStatusUseCase,
      getApplicationUseCase,
    } = this.applicationUseCases;

    router.use((req, res, next) => {
      console.log("job company routes", req.url, req.method);
      next();
    });

    // job application route access by company
    router
      .route("/application/all/:companyId")
      .get(ApplicationController.getAllApplication(getAllApplicationUseCase));

    router
      .route("/application/:id")
      .get(ApplicationController.getApplication(getApplicationUseCase))
      .put(
        ApplicationController.changeApplicationStatus(
          changeApplicationStatusUseCase
        )
      );

    // job route access by company

    const {
      getAllJobByCompanyIdUseCase,
      getApplicationByJobIdUseCase,
      getJobMetrixUseCase,
      getJobSeenUseCase,
      subscriptionCheckUseCase,
      updateFreeTrailUseCase
    } = this.companyUseCases;

    const { 
        jobPostUseCase, 
        updateJobUseCase 
      } = this.jobUseCase;
    console.log(
      "this.companyUseCases",
      this.companyUseCases,
      getAllJobByCompanyIdUseCase
    );

    const subscriptionWrapper = new TrailLimitMiddleware(
      subscriptionCheckUseCase
    ).checkTrailLimit;

    router.get(
      "/all",
      CompanyController.getAllJob(getAllJobByCompanyIdUseCase)
    );

    router.post(
      "/jobs",
      subscriptionWrapper,
      JobController.jobPost(
        jobPostUseCase,
        updateFreeTrailUseCase,
        this.notificationProducer,
        this.updateTrailProducer
      )
    );

    router.get(
      "/jobs/:id",
      CompanyController.getApplicatioByJobId(getApplicationByJobIdUseCase)
    );
    router.get("/stats", CompanyController.getJobMetrix(getJobMetrixUseCase));
    router.get("/view", CompanyController.getJobSeen(getJobSeenUseCase));
    return router;
  }
}
