import Stripe from "stripe";

export interface ICreatePaymentCase {
    execute(event: Stripe.Event): Promise<void>
}