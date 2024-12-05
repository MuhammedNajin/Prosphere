import { Repository } from "typeorm";
import { Plan } from "../database/sql/entities/plan.entity";
import { AppDataSource } from "../database/sql/connection";
import { IPaymentRepository } from "@/domain/IRespository/IPayment.repository";
import { IPlan } from "@/shared/types/plan.interface";


class PlanRepository implements IPaymentRepository{
    private repository: Repository<Plan>

    constructor() {
         this.repository = AppDataSource.getRepository(Plan)
    }

    private handleDBError() {
         
    }

    async createPlan(planDTO: Partial<IPlan>) {
         const plan = this.repository.create(planDTO);
         return await this.repository.save(plan);
    }
}


export default new PlanRepository()