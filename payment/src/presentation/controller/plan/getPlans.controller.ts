import { IPaymentRepository } from "@/domain/IRespository/IPayment.repository";
import { ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";
import { NextFunction, Request, Response } from "express";
import { IPlanRepository } from "@/domain/IRespository/IPlan.repository";
import { GetPlanUseCase } from "@/application/usecase/getPlan.usecase";

export class GetPlanController {
  constructor(private planRepo: IPlanRepository) {
    console.log(" get plan controller", planRepo);
    
  }
  
  public get = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log(req.body);
     const plan = await new GetPlanUseCase(this.planRepo).execute()
     
      res
       .status(StatusCode.OK)
       .json(ResponseUtil.success(plan));

    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
