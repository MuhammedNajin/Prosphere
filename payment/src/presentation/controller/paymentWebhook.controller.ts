import Stripe from "stripe";
import { BadRequestError, ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";
import { NextFunction, Request, Response } from "express";


export class WebhookPaymentController {
   private stripe: Stripe

   constructor() {
       this.stripe = new Stripe(process.env.SECRET_KEY!, {
         apiVersion: "2024-11-20.acacia"
       })
   }
  public create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { name, price, id } = req.body;
      const signature = req.headers['stripe-signature'];
      const enpointSeceret = process.env.STRIPE_WEBHOOK_SECRET as string;
       if(!signature) {
          throw new BadRequestError("stripe signature missing")
       }

       const event = this.stripe.webhooks.constructEvent(
         req.body,
         signature,
         enpointSeceret
       )
       
       console.log("event", event);
       
      res
       .status(StatusCode.CREATED)
       .json({});

    } catch (error) {

      console.log(error);
      next(error);
    }
  };
}
