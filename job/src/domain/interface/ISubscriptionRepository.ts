import { JobListingQueryParams } from "@/shared/types/interface";
import { JobEntity } from "../entity/jobEntity";
import { IComment } from "./IEntity";
import { SubscriptionDoc } from "@/shared/types/subscription";

export interface ISubscriptionRepository {
   createSubscription(companyId: string): Promise<SubscriptionDoc | null>

   findSubscription(companyId: string): Promise<SubscriptionDoc | null>

   updateFreeTrail(companyId: string, key: string): Promise<SubscriptionDoc | null>
}