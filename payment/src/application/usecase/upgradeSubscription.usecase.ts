import { IPaymentRepository } from "@/domain/IRespository/IPayment.repository";
import Stripe from "stripe";
import { IUpgradeSubscriptionUseCase } from "../interface/IUpgradeSubscription.usecase";
import { ISubscription } from "@/shared/types/subscription.interface";
import { ISubscriptionRepository } from "@/domain/IRespository/ISubscription.repository";
import { IUpgradeSubscription } from "@/shared/types/payment.interface";
import { BadRequestError } from "@muhammednajinnprosphere/common";


export class UpgradeSubscriptionUseCase implements IUpgradeSubscriptionUseCase {
  constructor(private subscriptionRepo: ISubscriptionRepository) {}

  public async execute({ companyId, price }: IUpgradeSubscription): Promise<number> {
   
    try {

      if(!companyId || !price) {
        throw new BadRequestError("Company id and price are required");
      }
        
      const currentSubscription = await  this.subscriptionRepo.getCurrentSubscription(companyId);

      if (!currentSubscription) {
        throw new BadRequestError("No subscription found for this company");
      }

      const amount = currentSubscription.amountPaid;
      const durationInDays = currentSubscription.planSnapshot.durationInDays;
      const daysUsed = this.getDayCount(currentSubscription.startDate.toISOString(), new Date().toISOString());

      const amountToRefund = (amount / durationInDays) * daysUsed;
      const paymentDue = parseInt(price) - amountToRefund;

      console.log(`
                   daysUsed: ${daysUsed} 
                   durationInDays: ${durationInDays}
                    amount: ${amount}
                    amountToRefund: ${amountToRefund}
                    paymentDue: ${paymentDue}
                  
                   `);

        return paymentDue
    
    } catch (error) {
        
      console.log(error, "createpayment");
      throw error;
    }
  }

  private getDayCount(startDate: string, currentDate: string): number {
    const start = new Date(startDate);
    const current = new Date(currentDate);

    const differenceInMs = current.getTime() - start.getTime();
    const dayCount = Math.floor(differenceInMs / (1000 * 60 * 60 * 24)); // Convert ms to days
  
    return dayCount;
  }
}
