import Stripe from "stripe";
import { ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";
import { NextFunction, Request, Response } from "express";
import { CreatePaymentUseCase } from "@/application/usecase/createPayment.usecase";
import { SubscriptionType } from "@/shared/types/payment.interface";


export class CreatePaymentController {

  constructor() {}

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, price, id, planId, companyId,  } = req.body;

      console.log(req.body);

       const sessionId = await new CreatePaymentUseCase().execute({
        name,
        price,
        id,
        planId,
        companyId,
        subscriptionType: SubscriptionType.INITIAL,
       })

      res.status(StatusCode.CREATED).json({ id: sessionId });

    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
