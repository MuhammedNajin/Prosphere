import { JobPostController } from "./jobPost.controller";
import { GetJobsController } from "./getJobs.controller";
import { UpdateJobController } from "./updateJob.controller";
import { AddCommentController } from "./addComment.controller";
import { JobLikeController } from "./jobLike.controller";
import { GetCommentController } from "./getComment.controller";
import { GetJobDetailsController } from "./getJobDetails.controller";
import {
  IJobPostUseCase,
  IgetJobsUseCase,
  IupdateJobsUseCase,
  IAddCommentUseCase,
  ILikeJobUseCase,
  IGetCommentUseCase,
  IgetJobDetailsUseCase,
  IJobsSeenUseCase,
} from "@application/interface/jobUsecase_interface";
import { JobSeenController } from "./jobSeen.controller";
import { Dependency } from "@/infra/config/dependencies";
import { IUpdateFreeTrailUseCase } from "@/application/interface/companyUsecase_interface.ts";
export class JobController {
  static jobPost(
    jobPostUseCase: IJobPostUseCase,
    updateFreeTrailUseCase: IUpdateFreeTrailUseCase,
    notificationProducer: Dependency["messageBroker"]["notificationProducer"],
    updateTrailProducer: Dependency["messageBroker"]["updateTrailProducer"]
  ) {
    return new JobPostController(
      jobPostUseCase,
      updateFreeTrailUseCase,
      notificationProducer,
      updateTrailProducer
    ).handler;
  }

  static getJobs(getJobsUseCase: IgetJobsUseCase) {
    return new GetJobsController(getJobsUseCase).handler;
  }

  static updateJob(updateJobsUseCase: IupdateJobsUseCase) {
    return new UpdateJobController(updateJobsUseCase).handler;
  }

  static jobSeen(jobSeensUseCase: IJobsSeenUseCase) {
    return new JobSeenController(jobSeensUseCase).handler;
  }

  static likeJob(likeJobUseCase: ILikeJobUseCase) {
    return new JobLikeController(likeJobUseCase).handler;
  }

  static addComment(addCommentUseCase: IAddCommentUseCase) {
    return new AddCommentController(addCommentUseCase).handler;
  }

  static getComment(getCommentUseCase: IGetCommentUseCase) {
    return new GetCommentController(getCommentUseCase).handler;
  }

  static getJobDetails(getJobDetailsUseCase: IgetJobDetailsUseCase) {
    return new GetJobDetailsController(getJobDetailsUseCase).handler;
  }
}
