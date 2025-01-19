import { IPaymentRepository } from "@/domain/IRespository/IPayment.repository";
import { ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";
import { NextFunction, Request, Response } from "express";
import { IPlanRepository } from "@/domain/IRespository/IPlan.repository";
import { GetPlanUseCase } from "@/application/usecase/getPlan.usecase";
import { GetCurrentSubscriptionUseCase } from "@/application/usecase/getCurrentPlan.usecase";
import { ISubscriptionRepository } from "@/domain/IRespository/ISubscription.repository";
export class GetCurrentSubscriptionController {
  constructor(private subscriptionRepo: ISubscriptionRepository) {
    console.log(" get plan controller");
    
  }
  
  public get = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
     
     const { companyId } = req.params;

     const subscription = await new GetCurrentSubscriptionUseCase(this.subscriptionRepo).execute(companyId)
     
      res
       .status(StatusCode.OK)
       .json(ResponseUtil.success(subscription));

    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
