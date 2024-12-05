import { Repository } from "typeorm";
import { Plan } from "../database/sql/entities/plan.entity";
import { AppDataSource } from "../database/sql/connection";
import { IPlan } from "@/shared/types/plan.interface";
import { ISubscriptionRepository } from "@/domain/IRespository/ISubscription.repository";
import { Subscription } from "../database/sql/entities/subscription.entity";


class SubscriptionRepository implements ISubscriptionRepository {
    private repository: Repository<Subscription>

    constructor() {
         this.repository = AppDataSource.getRepository(Subscription)
    }

    private handleDBError() {
         
    }

    async create(subscription) {
         const plan = this.repository.create(subscription);
         return await this.repository.save(plan);
    }
}


export default new SubscriptionRepository()