import { IJobStatsUseCase } from "@/application/interface/adminUsecase_interface.ts";
import { ResponseUtil, HttpStatusCode } from "@muhammednajinnprosphere/common";
import { NextFunction, Request, Response } from "express";

export class JobStatsController {
  constructor(private jobStatsUseCase: IJobStatsUseCase) {
      console.log("JobStatsController", jobStatsUseCase)
  }

  public handler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobStats = await this.jobStatsUseCase.execute();

      res
       .status(HttpStatusCode.OK)
       .json(ResponseUtil.success(jobStats));
       
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
