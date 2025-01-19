import express, { Router } from "express";
import { CreatePaymentController } from "../controller/payment/payment.controller";
import { IPlanRepository } from "@/domain/IRespository/IPlan.repository";
import { CreatePlanController } from "../controller/plan/createPlan.controller";
import { GetCurrentSubscriptionController } from "../controller/subscription/getCurrentSubscription.controller";
import { ISubscriptionRepository } from "@/domain/IRespository/ISubscription.repository";


class SubscriptionRouter {
  public router: Router;
  private getCurrentSubscriptionController: GetCurrentSubscriptionController

  constructor(private subscriptionRepo: ISubscriptionRepository) {

    this.router = Router();
    this.getCurrentSubscriptionController = new GetCurrentSubscriptionController(this.subscriptionRepo);
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.use(express.json());
    this.router.get("/payment/current-subscription/:companyId", this.getCurrentSubscriptionController.get);

  }
}

export default SubscriptionRouter;
