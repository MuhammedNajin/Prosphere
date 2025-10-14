import Subscription, { SubscriptionAttrs } from "../database/mongo/schema/subscription.schema";

export default {

  createSubscription: async (subAtrrs: SubscriptionAttrs) => {
    return await Subscription.build(subAtrrs).save();
  }, 

  findSubscription: async (companyId: string) => {
    return await Subscription.findOne({ companyId });
  },

  updateFreeTrail: async (companyId: string, key: string) => {
    console.log("updateTrail LImit repo", companyId, key);
    const update = { $inc: { [`${key}`]: 1 }}
    return await Subscription.findOneAndUpdate({ companyId }, update)
  },

  updateSubscription: async (subscription: SubscriptionAttrs) => {
   
     return await Subscription.updateOne({ companyId: subscription.companyId, }, {
       $set: subscription
     })
  }

};
