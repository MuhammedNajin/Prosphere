import { PlanEntity } from "@/domain/entities/plan.entity";
import { IPlanRepository } from "@/domain/IRespository/IPlan.repository";
import { IPlan } from "@/shared/types/plan.interface";
import { ICreatePlanCase } from "@application/interface/ICreatePlan.usecase";
import Stripe from "stripe";
import { IGetPlanUseCase } from "../interface/IGetPlan.usecase";


export class GetPlanUseCase implements IGetPlanUseCase {

  constructor(private paymentRepo: IPlanRepository) {}

  public async execute(): Promise<IPlan[] | null> {
    try {
      return await this.paymentRepo.get()
    } catch (error) {
      console.log(error, "createpayment");
      throw error;
    }
  }
}
