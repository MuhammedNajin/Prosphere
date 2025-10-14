import { IUpgradeSubscriptionUseCase } from "../interface/IUpgradeSubscription.usecase";
import { ISubscriptionRepository } from "@/domain/IRespository/ISubscription.repository";
import { IUpgradeSubscription } from "@/shared/types/payment.interface";
import { BadRequestError } from "@muhammednajinnprosphere/common";

export class UpgradeSubscriptionUseCase implements IUpgradeSubscriptionUseCase {
  constructor(private subscriptionRepo: ISubscriptionRepository) {}

  public async execute({ companyId, price }: IUpgradeSubscription): Promise<number> {
    try {
      if (!companyId || !price) {
        throw new BadRequestError("Company id and price are required");
      }

      const currentSubscription = await this.subscriptionRepo.getCurrentSubscription(companyId);

      if (!currentSubscription) {
        throw new BadRequestError("No active subscription found for this company");
      }

      const amount = currentSubscription.amountPaid;
      const durationInDays = currentSubscription.planSnapshot.durationInDays;

      // ✅ Cap daysUsed at total duration
      const daysUsed = Math.min(
        this.getDayCount(currentSubscription.startDate.toISOString(), new Date().toISOString()),
        durationInDays
      );

      // ✅ Calculate used vs. unused amount
      const amountUsed = (amount / durationInDays) * daysUsed;
      const amountToRefund = amount - amountUsed;

      // ✅ Ensure no negative dues
      const paymentDue = Math.max(Number(price) - amountToRefund, 0);

      console.log(`
        --- Upgrade Calculation ---
        daysUsed: ${daysUsed}
        durationInDays: ${durationInDays}
        originalAmount: ${amount}
        amountUsed: ${amountUsed}
        amountToRefund: ${amountToRefund}
        paymentDue: ${paymentDue}
      `);

      return paymentDue;
    } catch (error) {
      console.error("Error in UpgradeSubscriptionUseCase:", error);
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
