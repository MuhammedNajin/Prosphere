import { IPaymentRepository } from "@/domain/IRespository/IPayment.repository";
import { ICreatePaymentCase } from "@application/interface/ICreatePayment.usecase";
import Stripe from "stripe";


export class CreatePaymentUseCase implements ICreatePaymentCase {
  constructor(private paymentRepo: IPaymentRepository) {}

  public async execute(
     event: Stripe.Event
  ): Promise<void> {

    try {
      
       await this.paymentRepo.create()

    } catch (error) {
        
      console.log(error, "createpayment");
      throw error;
    }
  }
}
