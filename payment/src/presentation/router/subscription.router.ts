import express, { Router } from "express";
import { GetCurrentSubscriptionController } from "../controller/subscription/getCurrentSubscription.controller";
import { ISubscriptionRepository } from "@/domain/IRespository/ISubscription.repository";
import { UpdgradeSubscriptionController } from "../controller/subscription/upgradeSubscription.controller";


class SubscriptionRouter {
  public router: Router;
  private getCurrentSubscriptionController: GetCurrentSubscriptionController
  private updgradeSubscriptionController: UpdgradeSubscriptionController

  constructor(private subscriptionRepo: ISubscriptionRepository) {

    this.router = Router();
    this.getCurrentSubscriptionController = new GetCurrentSubscriptionController(this.subscriptionRepo);
    this.updgradeSubscriptionController = new UpdgradeSubscriptionController(this.subscriptionRepo);
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.use(express.json());
    this.router.get("/payment/current-subscription/:companyId", this.getCurrentSubscriptionController.get);
    this.router.post("/payment/subscription/upgrade/:companyId", this.updgradeSubscriptionController.upgrade);
  }
}

export default SubscriptionRouter;
