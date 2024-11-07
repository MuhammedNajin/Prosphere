import { IupdateJobsUseCase } from "@/application/interface/jobUsecase_interface";
import { NextFunction, Request, Response } from "express";
import { StatusCode, ResponseUtil } from "@muhammednajinnprosphere/common";


export class UpdateJobController {
  constructor(private updateJobUseCase: IupdateJobsUseCase) {}

  public handler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("req", req.body);
      const { id } = req.params;
      const job = await this.updateJobUseCase.execute(req.body, id);

      res
        .status(StatusCode.CREATED)
        .json(ResponseUtil.success(job, "Job Updated successfully"));
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
