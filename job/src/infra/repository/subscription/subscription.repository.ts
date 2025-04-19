import { SubscriptionAttrs } from "@/shared/types/subscription";
import Subscription from "@infra/database/mongo/schema/subscription.schema";

class SubscriptionRepository {
    
  async createSubscription(subAttrs: SubscriptionAttrs) {
    const subscription = Subscription.build(subAttrs);
    return await subscription.save();
  }

  async findSubscription(companyId: string) {
    return await Subscription.findOne({ companyId });
  }

   async updateFreeTrail(companyId: string, key: string) {
    console.log("updateTrail LImit repo", companyId, key);
    const update = { $inc: { [`${key}`]: 1 }}
    return await Subscription.findOneAndUpdate({ companyId }, update)
  }

  async updateSubscription  (subscription: SubscriptionAttrs) {
    return await Subscription.updateOne({ companyId: subscription.companyId, }, {
      $set: subscription
    })
 }
}

export default new SubscriptionRepository();
