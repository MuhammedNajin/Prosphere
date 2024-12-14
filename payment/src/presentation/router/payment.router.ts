import express, { Router } from "express";
import { CreatePaymentController } from "../controller/payment/payment.controller";
import { IPlanRepository } from "@/domain/IRespository/IPlan.repository";
import { IPaymentRepository } from "@/domain/IRespository/IPayment.repository";
import { WebhookPaymentController } from "../controller/payment/paymentWebhook.controller";
import { ISubscriptionRepository } from "@/domain/IRespository/ISubscription.repository";
import { ICompanyRepository } from "@/domain/IRespository/ICompany.repository";

class PaymentRouter {
  public router: Router;
  private paymentController;
  private webhookController;
  constructor(
    private subscriptionRepo: ISubscriptionRepository,
    private planRepo: IPlanRepository,
    private paymentRepo: IPaymentRepository,
    private companyRepo: ICompanyRepository
  ) {
    this.router = Router();
    this.paymentController = new CreatePaymentController();
    this.webhookController = new WebhookPaymentController(
      this.subscriptionRepo,
      this.planRepo,
      this.paymentRepo,
      this.companyRepo
    );
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
   
    this.router.post(
      "/payment/webhook",
      express.raw({ type: "application/json" }),
      this.webhookController.listen
    );
    
    this.router.use(express.json())
    this.router.post("/payment", this.paymentController.create);
  }
}

export default PaymentRouter;
