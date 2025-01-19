import express, { Router } from "express";
import { CreatePaymentController } from "../controller/payment/payment.controller";
import { IPlanRepository } from "@/domain/IRespository/IPlan.repository";
import { IPaymentRepository } from "@/domain/IRespository/IPayment.repository";
import { WebhookPaymentController } from "../controller/payment/paymentWebhook.controller";
import { ISubscriptionRepository } from "@/domain/IRespository/ISubscription.repository";
import { ICompanyRepository } from "@/domain/IRespository/ICompany.repository";
import { CheckoutSessionController } from "../controller/payment/checkoutSession.controller";
import { MessageBrokerProducers } from "@/infrastructure/messageBroker/kafka";

class PaymentRouter {
  public router: Router;
  private paymentController;
  private webhookController;
  private checkOutSessionController;
  constructor(
    private subscriptionRepo: ISubscriptionRepository,
    private planRepo: IPlanRepository,
    private paymentRepo: IPaymentRepository,
    private companyRepo: ICompanyRepository,
    private messageBroker: MessageBrokerProducers,
  ) {
    this.router = Router();
    this.paymentController = new CreatePaymentController();
    this.webhookController = new WebhookPaymentController(
      this.subscriptionRepo,
      this.planRepo,
      this.paymentRepo,
      this.companyRepo,
      this.messageBroker,
    );
    this.checkOutSessionController = new CheckoutSessionController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      "/payment/webhook",
      express.raw({ type: "application/json" }),
      this.webhookController.listen
    );

    this.router.use(express.json());
    this.router.post("/payment", this.paymentController.create);
    this.router.get("/payment/chekout-session", this.checkOutSessionController.check);
  }
}

export default PaymentRouter;
