import { Subscription } from "@/infrastructure/database/sql/entities/subscription.entity";
import { ICompany } from "@/shared/types/company.interface";
import { ISubscription } from "@/shared/types/subscription.interface";
import { Plan } from "@/infrastructure/database/sql/entities/plan.entity";
import { Company } from "@/infrastructure/database/sql/entities/company.entitiy";
export interface ISubscriptionRepository {
    create(subscription: Omit<ISubscription, "createdAt" | "updatedAt" | "status">): Promise<Subscription>;
    getbyCompanyId(companyId: string): Promise<ISubscription | null | ICompany>;
    getCurrentSubscription(companyId: string): Promise<ISubscription | null>
    updateFeaturesLimit(id: string, usage_stats: string): Promise<void | null>;
    upgradeSubscription({ companyId, plan, company }: { companyId: string,  plan: Plan, company: Company }): Promise<ISubscription | null>;
} 