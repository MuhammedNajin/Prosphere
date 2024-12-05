import { PlanEntity } from "@/domain/entities/plan.entity";
import { IPlanRepository } from "@/domain/IRespository/IPlan.repository";
import { IPlan } from "@/shared/types/plan.interface";
import { ICreatePlanCase } from "@application/interface/I";
import Stripe from "stripe";


export class CreateSubscriptionUseCase implements ICreatePlanCase {
  constructor(private paymentRepo: IPlanRepository) {}

  public async execute(
     planData: IPlan
  ): Promise<void> {

    try {
       const planDTO = new PlanEntity(planData);
      return await this.paymentRepo.createPlan(planDTO)

    } catch (error) {
        
      console.log(error, "createpayment");
      throw error;
    }
  }
}
