import Stripe from "stripe";
import {
  BadRequestError,
  ResponseUtil,
  StatusCode,
} from "@muhammednajinnprosphere/common";
import { NextFunction, Request, Response } from "express";
import { IPlanRepository } from "@/domain/IRespository/IPlan.repository";
import { IPaymentRepository } from "@/domain/IRespository/IPayment.repository";
import { ICompanyRepository } from "@/domain/IRespository/ICompany.repository";
import { HandleWebhookUseCase } from "@application/usecase/handleWebhook.usecase";
import { ISubscriptionRepository } from "@/domain/IRespository/ISubscription.repository";

export class WebhookPaymentController {
  private stripe: Stripe;

  constructor(
    private subscriptionRepo: ISubscriptionRepository,
    private planRepo: IPlanRepository,
    private paymentRepo: IPaymentRepository,
    private companyRepo: ICompanyRepository
  ) {
    console.log(" webhook controller", this.planRepo);
    
    this.stripe = new Stripe(process.env.SECRET_KEY!, {
      apiVersion: "2024-11-20.acacia",
    });
  }

  public listen = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const signature = req.headers["stripe-signature"];
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

      if (!signature) {
        throw new BadRequestError("Stripe signature missing");
      }

      // Use the raw buffer directly from the request
      const payload = req.body.toString()

      console.log(" data ", '/n', signature, '\n', payload, '\n', endpointSecret, req.body);
      

      const event = this.stripe.webhooks.constructEvent(
        payload,  // Use raw buffer directly
        signature,
        endpointSecret
      );

      console.log("Stripe event received:", event);

      await new HandleWebhookUseCase(
        this.subscriptionRepo,
        this.planRepo,
        this.companyRepo,
        this.paymentRepo
      ).execute(event);

      res.status(StatusCode.CREATED).json({ success: true });
    } catch (error) {
      console.error("Webhook verification error:", error);
      next(error);
    }
  };
}