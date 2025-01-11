import Stripe from "stripe";
import {
  BadRequestError,
  StatusCode,
} from "@muhammednajinnprosphere/common";
import { NextFunction, Request, Response } from "express";

export class CheckoutSessionController {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.SECRET_KEY!, {
      apiVersion: "2024-11-20.acacia",
    });
  }

  public check = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { session_id } = req.query;

      if (!session_id) {
        throw new BadRequestError('Session ID is required');
      }

      const session = await this.stripe.checkout.sessions.retrieve(session_id as string, {
        expand: ['customer']
      });

      const sessionCreatedAt = new Date(session.created * 1000);
      const currentTime = new Date();
      const timeDifferenceInMinutes = (currentTime.getTime() - sessionCreatedAt.getTime()) / (1000 * 60);

      if (timeDifferenceInMinutes > 1) {
        throw new BadRequestError('Session has expired. Please create a new payment session.');
      }

      if (session.payment_status !== 'paid') {
        return res.status(400).json({ error: 'Payment not completed' });
      }
      
      res
        .status(StatusCode.OK)
        .json({
          customer: session.customer,
          session: {
            id: session.id,
            amount_total: session.amount_total,
            payment_status: session.payment_status,
            metadata: session.metadata
          }
        });

    } catch (error) {
      console.error("Webhook verification error:", error);
      next(error);
    }
  };
}