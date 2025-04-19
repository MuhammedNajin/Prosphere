import { IJobStatsUseCase } from "@/application/interface/adminUsecase_interface.ts";
import { IGetJobMetrixUseCase } from "@/application/interface/companyUsecase_interface.ts";
import { TIME_FRAME } from "@/shared/types/enums";
import { ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";
import { NextFunction, Request, Response } from "express";

export class JobStatsController {
  constructor(private jobStatsUseCase: IJobStatsUseCase) {
      console.log("JobStatsController", jobStatsUseCase)
  }

  public handler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobStats = await this.jobStatsUseCase.execute();

      res
       .status(StatusCode.OK)
       .json(ResponseUtil.success(jobStats));
       
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
