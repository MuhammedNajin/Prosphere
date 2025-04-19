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
import { MessageBrokerProducers } from "@/infrastructure/messageBroker/kafka";

export class WebhookPaymentController {
  private stripe: Stripe;

  constructor(
    private subscriptionRepo: ISubscriptionRepository,
    private planRepo: IPlanRepository,
    private paymentRepo: IPaymentRepository,
    private companyRepo: ICompanyRepository,
    private messageBroker: MessageBrokerProducers
  ) {
    console.log(" webhook controller message broker", this.messageBroker.subscriptionProducer);
    
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

      const payload = req.body.toString()

      console.log(" data ", '/n', signature, '\n', payload, '\n', endpointSecret, req.body);
      

      const event = this.stripe.webhooks.constructEvent(
        payload,  // Use raw buffer directly
        signature,
        endpointSecret
      );

      console.log("Stripe event received:", event);

      const session = event.data.object as Stripe.Checkout.Session;

      const { metadata, created, id: paymentId,   } = session
      const { id, planId, companyId, subscriptionType } = metadata as any

     const subscription =  await new HandleWebhookUseCase(
        this.subscriptionRepo,
        this.planRepo,
        this.companyRepo,
        this.paymentRepo
      ).execute(event);

      console.log("subscription", subscription)

      if(subscription) {
         await this.messageBroker.subscriptionProducer.produce({
          companyId: companyId,
          duration: subscription.planSnapshot.durationInDays,
          endDate: subscription.endDate,
          startDate: subscription.startDate,
          subscriptionType,
          isSubscribed: true
         })
      }

      res.status(StatusCode.CREATED).json({ success: true });
    } catch (error) {
      console.error("Webhook verification error:", error);
      next(error);
    }
  };
}