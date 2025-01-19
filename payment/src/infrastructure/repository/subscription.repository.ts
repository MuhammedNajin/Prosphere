import { MoreThanOrEqual, Repository } from "typeorm";
import { AppDataSource } from "../database/sql/connection";
import { ISubscriptionRepository } from "@/domain/IRespository/ISubscription.repository";
import { Subscription } from "../database/sql/entities/subscription.entity";
import { ISubscription } from "@/shared/types/subscription.interface";
import { Company } from "../database/sql/entities/company.entitiy";
import { SubscriptionStatus, UsageMetrics } from "@/shared/types/enums";
import { ICompany } from "@/shared/types/company.interface";


class SubscriptionRepository implements ISubscriptionRepository {
    private repository: Repository<Subscription>
    private companyRepository: Repository<Company>
    constructor() {
         this.repository = AppDataSource.getRepository(Subscription)
         this.companyRepository = AppDataSource.getRepository(Company)
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

    async getbyCompanyId(companyId: string): Promise<ISubscription | null | ICompany> {
      try {

        const company = await this.companyRepository.findOne({
           where: { companyId }
        });

        if(!company) {
          return null;
        }

        const subscription = await this.repository.findOne({
           where: { id: company.id }
        })

        return { subscription: subscription, company: company }

      } catch (error) {
        console.log(error)
        throw error
      }
    }

   async getCurrentSubscription(companyId: string) {
        try {
          return await this.repository.findOne({
             where: {
               company: { companyId },
               status: SubscriptionStatus.ACTIVE,
               endDate: MoreThanOrEqual(new Date()),
             },
             relations: ['company']
          })
        } catch (error) {
          console.log(error);
          throw error
        }
    }


    async updateFeaturesLimit(id: string, usage_stats: UsageMetrics) {
       try {
         const subscription = await this.repository.findOne({
             where: {
               id: parseInt(id),
             }
          })

          console.log("subscription", subscription, usage_stats);

          if(!subscription) {
             return null;
          }

          if(subscription?.usageStats[usage_stats]) {
            subscription.usageStats[usage_stats]++
          }
         
         await this.repository.save(subscription);

       } catch (error) {
          console.log(error);
          throw error;
       }
    }

    async updateExpiredSubscriptions() {
      const now = new Date();
      try {
        await this.repository.update(
          { 
            where: {
              status: SubscriptionStatus.ACTIVE,
              endDate: { $lt: now },
              isTrial: false
            }
          },
          { 
            status: SubscriptionStatus.EXPIRED
          }
        );
      } catch(err) {
         console.log(err);
         throw err;
      }
    }
}


export default new SubscriptionRepository()