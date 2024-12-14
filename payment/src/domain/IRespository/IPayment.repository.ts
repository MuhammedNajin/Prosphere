import { Subscription } from "@/infrastructure/database/sql/entities/subscription.entity";
import { PaymentStatus } from "@/shared/types/enums";
import { ISubscription } from "@/shared/types/subscription.interface";

export interface IPaymentRepository {
    create(subscription: Subscription, status: PaymentStatus): Promise<void>
} 