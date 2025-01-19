import { PlanEntity } from "@/domain/entities/plan.entity";
import { IPlanRepository } from "@/domain/IRespository/IPlan.repository";
import { IPlan } from "@/shared/types/plan.interface";
import { ICreatePlanCase } from "@application/interface/ICreatePlan.usecase";

export class CreatePlanUseCase implements ICreatePlanCase {
  constructor(private planRepo: IPlanRepository) {}

  public async execute(planData: IPlan): Promise<IPlan> {
    try {
      const planDTO = PlanEntity.create(planData);
      return await this.planRepo.createPlan(planDTO);
    } catch (error) {
      console.log("createpayment", error);
      throw error;
    }
  }
}
