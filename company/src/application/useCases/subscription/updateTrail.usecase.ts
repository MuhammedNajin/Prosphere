
@injectable()
export class UpdateTrialUseCase {
  constructor(
    @inject(Repositories.SubscriptionRepository) private subscriptionRepository: ISubscriptionRepository
  ) {
    if (!subscriptionRepository) {
      throw new Error("UpdateTrialUseCase initialization error: 'subscriptionRepository' is required.");
    }
  }

  async execute(companyId: string, key: string): Promise<any> {
    if (!companyId || !validateObjectId(companyId)) {
      throw new BadRequestError("Invalid company ID.");
    }
    if (!key) {
      throw new BadRequestError("Key is required.");
    }
    const subscription = await this.subscriptionRepository.updateFreeTrial(companyId, key);
    if (!subscription) {
      throw new NotFoundError(`Subscription for company ID '${companyId}' not found.`);
    }
    return subscription;
  }
}
