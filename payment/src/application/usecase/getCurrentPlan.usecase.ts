import { IPlan } from "@/shared/types/plan.interface";
import { IGetCurrentSubscriptionUseCase } from "../interface/IGetCurrentPlan.usecase";
import { ISubscriptionRepository } from "@/domain/IRespository/ISubscription.repository";
import { ISubscription } from "@/shared/types/subscription.interface";


export class GetCurrentSubscriptionUseCase implements IGetCurrentSubscriptionUseCase {

  constructor(private paymentRepo: ISubscriptionRepository) {}

  public async execute(companyId: string): Promise<ISubscription | null> {
    try {
      return await this.paymentRepo.getCurrentSubscription(companyId)
    } catch (error) {
      console.log(error, "createpayment");
      throw error;
    }
  }
}
