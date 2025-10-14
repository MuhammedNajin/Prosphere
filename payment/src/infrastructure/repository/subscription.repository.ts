import { MoreThanOrEqual, LessThan, Repository } from "typeorm";
import { AppDataSource } from "../database/sql/connection";
import { ISubscriptionRepository } from "@/domain/IRespository/ISubscription.repository";
import { Subscription } from "../database/sql/entities/subscription.entity";
import { ISubscription } from "@/shared/types/subscription.interface";
import { SubscriptionStatus } from "@/shared/types/enums";
import { SubscriptionType } from "@/shared/types/payment.interface";

class SubscriptionRepository implements ISubscriptionRepository {
  private repository: Repository<Subscription>;
  
  constructor() {
    this.repository = AppDataSource.getRepository(Subscription);
  }

  async create(subscription: Partial<ISubscription>): Promise<Subscription> {
     const sub = this.repository.create({
    jobsAllowed: subscription.jobsAllowed ?? 100,
    jobsUsed: subscription.jobsUsed ?? 0,
    ...subscription,
  });
  return await this.repository.save(sub);
  }

  async getCurrentSubscription(companyId: string): Promise<Subscription | null> {
    return await this.repository.findOne({
      where: {
        companyId,
        status: SubscriptionStatus.ACTIVE,
        endDate: MoreThanOrEqual(new Date()),
      },
    });
  }

  async incrementJobsUsed(companyId: string): Promise<void> {
  const subscription = await this.getCurrentSubscription(companyId);

  if (!subscription) {
    throw new Error("No active subscription found");
  }

  // Optional: Check if limit exceeded
  if (
    subscription.jobsAllowed > 0 &&
    subscription.jobsUsed >= subscription.jobsAllowed
  ) {
    throw new Error("Job posting limit reached for this subscription");
  }

  subscription.jobsUsed += 1;
  await this.repository.save(subscription);
}


  async upgradeSubscription({ companyId, plan }: { companyId: string; plan: any }) {
    const current = await this.getCurrentSubscription(companyId);
    if (current) {
      current.status = SubscriptionStatus.CANCELLED;
      current.cancellationReason = SubscriptionType.UPGRADE;
      current.endDate = new Date();
      await this.repository.save(current);
    }

     const newSub = this.repository.create({
    companyId,
    planSnapshot: plan,
    amountPaid: plan.price,
    status: SubscriptionStatus.ACTIVE,
    startDate: new Date(),
    endDate: new Date(Date.now() + plan.durationInDays * 24 * 60 * 60 * 1000),
    jobsAllowed: 100,   // ✅ important
    jobsUsed: 0,
    isTrial: false,
  });

    return await this.repository.save(newSub);
  }

  async expireOldSubscriptions() {
    const now = new Date();
    await this.repository
      .createQueryBuilder()
      .update(Subscription)
      .set({ status: SubscriptionStatus.EXPIRED })
      .where("status = :status", { status: SubscriptionStatus.ACTIVE })
      .andWhere("endDate < :now", { now })
      .execute();
  }
}

export default new SubscriptionRepository();
