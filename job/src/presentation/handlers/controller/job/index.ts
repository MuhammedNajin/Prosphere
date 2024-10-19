import { JobPostController } from "./jobPost.controller";
import { GetJobsController } from "./getJobs.controller";
import {
  IJobPostUseCase,
  IgetJobsUseCase,
} from "@application/interface/jobUsecase_interface";
export class JobController {
  static jobPost(jobPostUseCase: IJobPostUseCase) {
    return new JobPostController(jobPostUseCase).handler;
  }

  static getJobs(getJobsUseCase: IgetJobsUseCase) {
    return new GetJobsController(getJobsUseCase).handler;
  }
}
