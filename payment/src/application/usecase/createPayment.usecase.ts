import { IPaymentRepository } from "@/domain/IRespository/IPayment.repository";
import { ICreatePaymentParams } from "@/shared/types/payment.interface";
import { ICreatePaymentCase } from "@application/interface/ICreatePayment.usecase";
import Stripe from "stripe";


export class CreatePaymentUseCase implements ICreatePaymentCase {
  private stripe: Stripe;
  constructor() {
    this.stripe = new Stripe(process.env.SECRET_KEY!, {
      apiVersion: "2024-11-20.acacia",
    });
  }

  public async execute(
  {
    companyId,
    id,
    name,
    planId,
    price,
    subscriptionType
  }: ICreatePaymentParams
  ): Promise<string> {

    try {
      console.log("create payment", name, price, id, planId, companyId, subscriptionType);
      
      const customer = await this.stripe.customers.create({
        name,
        address: {
          country: "india",
          city: "kozhikode",
          line1: "streel 11",
          postal_code: "652833",
        },
      });

      const line_items = [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: name,
            },
            unit_amount: Math.round(parseInt(price) * 100),
          },
          quantity: 1,
        },
      ];

      const baseUrl = process.env.BASE_URL;

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        success_url: `${baseUrl}/company/payment/success?session_id={CHECKOUT_SESSION_ID}&id=${companyId}`,
        cancel_url: `${baseUrl}/premium`,
        client_reference_id: id,
        line_items,
        customer: customer.id,
        metadata: {
          id,
          planId,
          companyId,
          subscriptionType
        },
      });

      return session.id;

    } catch (error) {
        
      console.log(error, "createpayment");
      throw error;
    }
  }
}
