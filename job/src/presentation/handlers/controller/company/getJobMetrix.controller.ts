import {IGetJobMetrixUseCase
} from "@/application/interface/companyUsecase_interface.ts";
import { TIME_FRAME } from "@/shared/types/enums";
import { ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";
import { NextFunction, Request, Response } from "express";

export class GetJobMetrixController {

  constructor(private getJobsByJobIdUseCase: IGetJobMetrixUseCase) {}

  public handler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("get job metrix controller");
       const { companyId, timeFrame, startDate, endDate } = req.query;
       const dateRange = {
         startDate,
         endDate
       }
       const jobs = await this.getJobsByJobIdUseCase.execute(companyId as string, timeFrame as TIME_FRAME, dateRange);

      res
       .status(StatusCode.OK)
       .json(ResponseUtil.success(jobs));

    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
