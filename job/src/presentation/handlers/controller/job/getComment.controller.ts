import { IGetCommentUseCase } from "@/application/interface/jobUsecase_interface"; 
import { NextFunction, Request, Response } from "express";
import { StatusCode, ResponseUtil } from "@muhammednajinnprosphere/common";

export class GetCommentController {
  constructor(private getCommentsUseCase: IGetCommentUseCase) {}

  public handler = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { jobId } = req.query;
      console.log("jobId", jobId)
      const comments = await this.getCommentsUseCase.execute(jobId as string);

      res
        .status(StatusCode.OK)
        .json(ResponseUtil.success(comments, "Comments retrieved successfully"));

    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
