import { IPaymentRepository } from "@/domain/IRespository/IPayment.repository";
import { ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";
import { NextFunction, Request, Response } from "express";
import { EditPlanUseCase } from "@/application/usecase/editPlan.usecase";
import { IPlanRepository } from "@/domain/IRespository/IPlan.repository";

export class UpdatePlanController {
  constructor(private planRepo: IPlanRepository) {}

  public update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {

      console.log(req.body);
      const { id } = req.params;
      const planId = parseInt(id);
     const plan = await new EditPlanUseCase(this.planRepo).execute(planId, req.body);

      res
       .status(StatusCode.CREATED)
       .json(ResponseUtil.success(plan));

    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
