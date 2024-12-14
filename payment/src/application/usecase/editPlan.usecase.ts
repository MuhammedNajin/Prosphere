import { PlanEntity } from "@/domain/entities/plan.entity";
import { IPlanRepository } from "@/domain/IRespository/IPlan.repository";
import { IPlan } from "@/shared/types/plan.interface";
import { IEditPlanCase } from "../interface/IEditPlan.usecase";


export class EditPlanUseCase implements IEditPlanCase {
  constructor(private paymentRepo: IPlanRepository) {}

  public async execute(
    id: number,
     planData: object
  ): Promise<IPlan | null> {

    try {
       
       return await this.paymentRepo.editPlan(id, planData)

    } catch (error) {
        
      console.log(error, "createpayment");
      throw error;
    }
  }
}
