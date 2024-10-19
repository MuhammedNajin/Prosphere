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
      console.log("req", req.params);
      const { id } = req.params;
      const jobs = await this.getJobsUseCase.execute(id);

      res.status(200).json({
        success: true,
        jobs,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
