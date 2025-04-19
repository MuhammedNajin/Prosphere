import { Subscription } from "@/domain/entities/subscription.entity";
import { ISubscription } from "@/shared/types/subscription.interface";
import Stripe from "stripe";

export interface IHandleWebhookUseCase {
    execute(event: Stripe.Event): Promise<ISubscription | null>
}