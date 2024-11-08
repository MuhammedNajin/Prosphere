import { IAddCommentUseCase } from "@/application/interface/jobUsecase_interface"; 
import { NextFunction, Request, Response } from "express";
import { StatusCode, ResponseUtil } from "@muhammednajinnprosphere/common";

export class AddCommentController {
  constructor(private addCommentUseCase: IAddCommentUseCase) {}

  public handler = async (req: Request, res: Response, next: NextFunction) => {
    try {

      console.log("reqfff", req.body, "user", req.headers['x-user-data']);
      const { id } = JSON.parse(req.headers['x-user-data'] as string)
      const { jobId, comment } = req.body; 
      const commentDoc = await this.addCommentUseCase.execute({ userId: id, jobId, comment });

      res
        .status(StatusCode.CREATED)
        .json(ResponseUtil.success(commentDoc, "Comment added successfully"));

    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
