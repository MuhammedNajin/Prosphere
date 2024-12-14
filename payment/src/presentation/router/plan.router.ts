import express, { Router } from "express";
import { CreatePaymentController } from "../controller/payment/payment.controller";
import { IPlanRepository } from "@/domain/IRespository/IPlan.repository";
import { CreatePlanController } from "../controller/plan/createPlan.controller";
import { GetPlanController } from "../controller/plan/getPlans.controller";
import { UpdatePlanController } from "../controller/plan/editPlan.controller";
import { DeletePlanController } from "../controller/plan/deletePlan.controller";

class PlanRouter {
  public router: Router;
  private createPlanController
  private getPlanController
  private updateController
  private deleteCOntroller
  constructor(private planRepo: IPlanRepository) {
    console.log(planRepo.get);
    this.router = Router();
    this.createPlanController = new CreatePlanController(this.planRepo);
    this.getPlanController = new GetPlanController(this.planRepo);
    this.updateController = new UpdatePlanController(this.planRepo);
    this.deleteCOntroller = new DeletePlanController(this.planRepo);
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.use(express.json());
    this.router.get("/payment/plans", this.getPlanController.get);
    this.router.post("/payment/plans", this.createPlanController.create);
    this.router.put("/payment/plans/:id", this.updateController.update);
    this.router.delete("/payment/plans/:id", this.deleteCOntroller.delete);
  }
}

export default PlanRouter;
