import { IJobsSeenUseCase, IupdateJobsUseCase } from "@/application/interface/jobUsecase_interface";
import { NextFunction, Request, Response } from "express";
import { HttpStatusCode, ResponseUtil } from "@muhammednajinnprosphere/common";


export class JobSeenController {
  constructor(private jobSeenUseCase: IJobsSeenUseCase) {}

  public handler = async (req: Request, res: Response, next: NextFunction) => {
    try {
    
      const { id } = req.params;
      const userId = JSON.parse(req.headers['x-user-data'] as string).id
       await this.jobSeenUseCase.execute(id, userId);

      res
        .sendStatus(HttpStatusCode.CREATED)
      
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
