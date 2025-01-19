import { IPlan } from "@/shared/types/plan.interface";
import { ISubscription } from "@/shared/types/subscription.interface";

export interface IGetCurrentSubscriptionUseCase {
    execute(companyId: string): Promise<ISubscription | null>
}