import { Repository } from "typeorm";
import { Plan } from "../database/sql/entities/plan.entity";
import { AppDataSource } from "../database/sql/connection";
import { IPaymentRepository } from "@/domain/IRespository/IPayment.repository";
import { Payment } from "../database/sql/entities/payment.entity";


class PaymentRepository implements IPaymentRepository {
    private repository: Repository<Payment>

    constructor() {
         this.repository = AppDataSource.getRepository(Payment)
    }

    private handleDBError() {
         
    }

    async create(paymentDTO) {
         const payment = this.repository.create(paymentDTO);
         return await this.repository.save(payment);
    }
}


export default new PaymentRepository()