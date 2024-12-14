import { Repository } from "typeorm";
import { Plan } from "../database/sql/entities/plan.entity";
import { AppDataSource } from "../database/sql/connection";
import { IPaymentRepository } from "@/domain/IRespository/IPayment.repository";
import { Payment } from "../database/sql/entities/payment.entity";
import { ISubscription } from "@/shared/types/subscription.interface";
import { Subscription } from "../database/sql/entities/subscription.entity";
import { PaymentStatus } from "@/shared/types/enums";


class PaymentRepository implements IPaymentRepository {
    private repository: Repository<Payment>

    constructor() {
         this.repository = AppDataSource.getRepository(Payment)
    }

    private handleDBError() {
         
    }

    async create(subscription: Subscription, status: PaymentStatus) {
         const payment = this.repository.create({
           subscription,
           paymentMethod: 'Stripe',
           status
         });
       await this.repository.save(payment);
    }
}

export default new PaymentRepository()