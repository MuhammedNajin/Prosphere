import Stripe from "stripe";
import { ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";
import { NextFunction, Request, Response } from "express";

export class CreatePaymentController {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.SECRET_KEY!, {
      apiVersion: "2024-11-20.acacia",
    });
  }
  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, price, id, planId, companyId } = req.body;
      console.log(req.body);
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
        },
      });

      res.status(StatusCode.CREATED).json({ id: session.id });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
