import { IPaymentRepository } from "@/domain/IRespository/IPayment.repository";
import { ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";
import { NextFunction, Request, Response } from "express";
import { ISubscriptionRepository } from "@/domain/IRespository/ISubscription.repository";
import { CreatePaymentUseCase } from "@/application/usecase/createPayment.usecase";
import { SubscriptionType } from "@/shared/types/payment.interface";
import { customLogger } from "@/presentation/middlewate/loggerMiddleware";
import { UpgradeSubscriptionUseCase } from "@/application/usecase/upgradeSubscription.usecase";

export class UpdgradeSubscriptionController {
  constructor(private subscriptionRepo: ISubscriptionRepository) {}

  public upgrade = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, price, id, planId, companyId } = req.body;

      customLogger.info("upgrade subscription", req.body);

      const paymentDue = await new UpgradeSubscriptionUseCase(this.subscriptionRepo).execute({
        companyId,
        price,
      });

      // if(typeof)

      const sessionId = await new CreatePaymentUseCase().execute({
        name,
        price: paymentDue.toString(),
        id,
        planId,
        companyId,
        subscriptionType: SubscriptionType.UPGRADE,
      });
      res.status(StatusCode.CREATED).json({ id: sessionId });
      
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
