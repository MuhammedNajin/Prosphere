import { ISubscription } from "@/shared/types/subscription.interface";
import Stripe from "stripe";

export interface IHandleWebhookUseCase {
    execute(event: Stripe.Event): Promise<void>
}