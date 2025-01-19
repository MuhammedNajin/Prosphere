import { PlanEntity } from "@/domain/entities/plan.entity";
import { IPlanRepository } from "@/domain/IRespository/IPlan.repository";
import { ISubscriptionRepository } from "@/domain/IRespository/ISubscription.repository";
import { IPlan } from "@/shared/types/plan.interface";
import { IHandleWebhookUseCase } from "@/application/interface/IHandleWebhook.usecase";
import Stripe from "stripe";
import { Subscription } from "@/domain/entities/subscription.entity";
import { ICompanyRepository } from "@/domain/IRespository/ICompany.repository";
import { ICompany } from "@/shared/types/company.interface";
import { IPaymentRepository } from "@/domain/IRespository/IPayment.repository";
import { PaymentStatus } from "@/shared/types/enums";


export class HandleWebhookUseCase implements IHandleWebhookUseCase {
  constructor(private subscriptionRepo: ISubscriptionRepository, private planRepo: IPlanRepository, private companyRepo: ICompanyRepository, private paymentRepo: IPaymentRepository) {
        console.log( "handle payment webhook",this.planRepo)
  }

  public async execute(
     event: Stripe.Event
  ): Promise<Subscription |null> {

    try {
      const session = event.data.object as Stripe.Checkout.Session;

      const { metadata, created, id: paymentId,   } = session
      const { id, planId, companyId,} = metadata as any
    
      const plan = await this.planRepo.getPlan(planId) as IPlan
      const company = await this.companyRepo.getCompany(companyId) as ICompany

      const subscriptionProps = {
        plan,
        company,
        amountPaid: plan?.price as number,
        startDate: new Date(),
        endDate: new Date(new Date().getTime() + (plan.durationInDays * 24 * 60 * 60 * 1000)),
     }

     const subscriptionDTO = new Subscription(subscriptionProps)
     let subscription;

      switch(event.type) {

        case "checkout.session.completed":
          subscription = await this.subscriptionRepo.create(subscriptionDTO)
          await this.paymentRepo.create(subscription, PaymentStatus.SUCCESS)
          return subscription;
        case "checkout.session.async_payment_failed" :
          subscription = await this.subscriptionRepo.create(subscriptionDTO)
          await this.paymentRepo.create(subscription, PaymentStatus.FAILED)

          break;   
      }
       return null;
    } catch (error) {  
      console.log(error, "createpayment");
      throw error;
    }
  }
}
