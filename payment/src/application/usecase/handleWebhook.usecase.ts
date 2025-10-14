import { IPlanRepository } from "@/domain/IRespository/IPlan.repository";
import { ISubscriptionRepository } from "@/domain/IRespository/ISubscription.repository";
import { ICompanyRepository } from "@/domain/IRespository/ICompany.repository";
import { IPaymentRepository } from "@/domain/IRespository/IPayment.repository";
import { IHandleWebhookUseCase } from "@/application/interface/IHandleWebhook.usecase";
import { IPlan } from "@/shared/types/plan.interface";
import { ISubscription } from "@/shared/types/subscription.interface";
import { SubscriptionStatus, PaymentStatus } from "@/shared/types/enums";
import { SubscriptionType } from "@/shared/types/payment.interface";
import Stripe from "stripe";

export class HandleWebhookUseCase implements IHandleWebhookUseCase {
  constructor(
    private subscriptionRepo: ISubscriptionRepository,
    private planRepo: IPlanRepository,
    private paymentRepo: IPaymentRepository
  ) {}

  public async execute(event: Stripe.Event): Promise<ISubscription | null> {
    try {
      const session = event.data.object as Stripe.Checkout.Session;
      const { metadata, id: paymentId } = session;
      const { planId, companyId, subscriptionType } = metadata as any;

      // Get plan
      const plan = await this.planRepo.getPlan(planId);
      if (!plan) {
        throw new Error(`Plan not found with id ${planId}`);
      }

      // Build subscription data
      const subscriptionProps: Omit<
        ISubscription,
        "id" | "status" | "createdAt" | "updatedAt"
      > = {
        planSnapshot: {
          id: plan.id,
          name: plan.name,
          price: plan.price,
          durationInDays: plan.durationInDays,
          features: plan.features,
        },
        companyId,
        startDate: new Date(),
        endDate: new Date(
          new Date().getTime() + plan.durationInDays * 24 * 60 * 60 * 1000
        ),
        amountPaid: plan.price,
        jobsAllowed: 100,
        jobsUsed: 0,
        isTrial: false,
        trialEndsAt: null,
        cancelledAt: null,
        cancellationReason: null,
      };

      let subscription: ISubscription | null = null;

      switch (event.type) {
        case "checkout.session.completed":
          if (subscriptionType === SubscriptionType.UPGRADE) {
            // Upgrade existing subscription
            subscription = await this.subscriptionRepo.upgradeSubscription({
              companyId,
              plan,
            });
          } else {
            // Create fresh subscription
            console.log("creating new subscription", subscriptionProps);
            subscription = await this.subscriptionRepo.create(
              subscriptionProps
            );
          }

          if (subscription) {
            const charge = event.data.object as Stripe.Charge;

            await this.paymentRepo.create({
              subscription: subscription as any,
              amount: plan.price,
              status: PaymentStatus.SUCCESS,
              paymentMethod: charge.payment_method_details?.type || "unknown",
              transactionId: charge.payment_intent || charge.id,
              metadata: {
                provider: "stripe",
                cardLast4: charge.payment_method_details?.card?.last4,
                receiptUrl: charge.receipt_url,
              },
            });
          }

          return subscription;

        case "checkout.session.async_payment_failed":
          // Still record failed attempt
          subscription = await this.subscriptionRepo.create({
            ...subscriptionProps,
            status: SubscriptionStatus.EXPIRED,
          });

          await this.paymentRepo.create({
            companyId,
            subscriptionId: subscription.id,
            paymentId,
            status: PaymentStatus.FAILED,
            amount: plan.price,
          });

          return subscription;

        default:
          return null;
      }
    } catch (error) {
      console.error("Error handling webhook:", error);
      throw error;
    }
  }
}
