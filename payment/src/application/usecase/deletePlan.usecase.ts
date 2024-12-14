
import { IPlanRepository } from "@/domain/IRespository/IPlan.repository";
import { IDeleltePlanCase } from "../interface/IDeletePlan.usecase";


export class DeleltePlanUseCase implements IDeleltePlanCase {
  constructor(private paymentRepo: IPlanRepository) {}

  public async execute(
    id: number,
  ): Promise<void> {

    try {
       return await this.paymentRepo.deletePlan(id)
    } catch (error) {
        
      console.log(error, "delete ");
      throw error;
    }
  }
}
