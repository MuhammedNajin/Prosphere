import { IPaymentRepository } from "@/domain/IRespository/IPayment.repository";
import { ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";
import { NextFunction, Request, Response } from "express";
import { CreatePlanUseCase } from "@/application/usecase/createPlan.usecase";

export class CreatePlanController {
  constructor(private planRepo: IPaymentRepository) {}

  public create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log(req.body);
     const plan = await new CreatePlanUseCase(this.planRepo).execute(req.body);

      res
       .status(StatusCode.CREATED)
       .json(ResponseUtil.success(plan));

    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
