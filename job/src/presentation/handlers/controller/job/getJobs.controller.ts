import {
  IJobPostUseCase,
  IgetJobsUseCase,
} from "@/application/interface/jobUsecase_interface";
import { NextFunction, Request, Response } from "express";

export class GetJobsController {
  private getJobsUseCase: IgetJobsUseCase;
  constructor(getJobsUseCase: IgetJobsUseCase) {
    this.getJobsUseCase = getJobsUseCase;
  }

  public handler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const jobs = await this.getJobsUseCase.execute();

      res.status(200).json({
        jobs
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
