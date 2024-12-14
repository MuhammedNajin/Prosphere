import { Repository } from "typeorm";
import { Plan } from "../database/sql/entities/plan.entity";
import { AppDataSource } from "../database/sql/connection";
import { IPlan } from "@/shared/types/plan.interface";
import { ISubscriptionRepository } from "@/domain/IRespository/ISubscription.repository";
import { Subscription } from "../database/sql/entities/subscription.entity";
import { ISubscription } from "@/shared/types/subscription.interface";


class SubscriptionRepository implements ISubscriptionRepository {
    private repository: Repository<Subscription>

    constructor() {
         this.repository = AppDataSource.getRepository(Subscription)
    }

    private handleDBError() {
         
    }

    async create(subscription:  Omit<ISubscription, "createdAt" | "updatedAt" | "status">): Promise<Subscription> {
        try {
          const plan = this.repository.create(subscription);
          return await this.repository.save(plan);
        } catch (error) {
          throw error;
        }
    }
}


export default new SubscriptionRepository()