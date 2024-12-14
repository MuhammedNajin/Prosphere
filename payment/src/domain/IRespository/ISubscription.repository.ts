import { Subscription } from "@/infrastructure/database/sql/entities/subscription.entity";
import { IPlan } from "@/shared/types/plan.interface";
import { ISubscription } from "@/shared/types/subscription.interface";

export interface ISubscriptionRepository {
    create(subscription: Omit<ISubscription, "createdAt" | "updatedAt" | "status">): Promise<Subscription>
} 