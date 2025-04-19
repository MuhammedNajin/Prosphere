import {
  IgetApplicationUseCase,
  IisAppliedUseCase,
} from "@/application/interface/applicationUsecase_interface.ts";
import { ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";
import { application, NextFunction, Request, Response } from "express";

export class IsAppliedController {
  constructor(private isAppliedUseCase: IisAppliedUseCase) {}

  public handler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = JSON.parse(req.headers["x-user-data"] as string);
      const { jobId } = req.params;
      console.log(id, jobId)
      const application = await this.isAppliedUseCase.execute(id, jobId);
      console.log("application", application);

      if (!application) {
        return res
          .status(StatusCode.OK)
          .json(ResponseUtil.success({ status: false }));
      }

      res.status(StatusCode.OK).json(ResponseUtil.success({ status: true }));
    } catch (error) {
      console.log("controller", error);
      next(error);
    }
  };
}
