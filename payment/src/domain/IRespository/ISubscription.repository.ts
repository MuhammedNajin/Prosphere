import { IPlan } from "@/shared/types/plan.interface";

export interface ISubscriptionRepository {
    create(subscription: unknown): Promise<void>
} 