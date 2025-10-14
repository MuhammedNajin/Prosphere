import { Repositories } from "@/di/symbols";
import { inject, injectable } from "inversify";

@injectable()
export class SubscriptionCheckUseCase {
  constructor(
    @inject(Repositories.SubscriptionRepository) private subscriptionRepository: ISubscriptionRepository
  ) {
    if (!subscriptionRepository) {
      throw new Error("SubscriptionCheckUseCase initialization error: 'subscriptionRepository' is required.");
    }
  }

  async execute(companyId: string): Promise<any> {
    if (!companyId || !validateObjectId(companyId)) {
      throw new BadRequestError("Invalid company ID.");
    }
    const subscription = await this.subscriptionRepository.findSubscription(companyId);
    if (!subscription) {
      throw new NotFoundError(`Subscription for company ID '${companyId}' not found.`);
    }
    return subscription;
  }
}