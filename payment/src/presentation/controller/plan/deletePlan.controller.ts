import { ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";
import { NextFunction, Request, Response } from "express";
import { DeleltePlanUseCase } from "@/application/usecase/deletePlan.usecase";
import { IPlanRepository } from "@/domain/IRespository/IPlan.repository";

export class DeletePlanController {
  constructor(private planRepo: IPlanRepository) {}

  public delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {

      console.log(req.body);
      const { id } = req.params;
      const planId = parseInt(id);
      await new DeleltePlanUseCase(this.planRepo).execute(planId);

      res
       .status(StatusCode.CREATED)
       .json(ResponseUtil.success({ deleted: true }));

    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
