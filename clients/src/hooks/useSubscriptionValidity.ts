import { CompanyUsageData, SubscriptionData } from "@/types/subscription";
import { useMemo, useRef, useState } from "react";
import { useSubscription } from "./useSubscription";

export const useSubscriptionValidity = () => {
    const ref = useRef({
      job: false,
      message: false
    })
    const subscription: { subscription: SubscriptionData, company: CompanyUsageData, isTrail: boolean } = useSubscription();
   
    return useMemo(() => {
      console.log("subscription", subscription);
      
      if (!subscription) {
        return false;
      }

      if(subscription.isTrail) {
        console.log("tail",subscription.company?.usage_stats['job_posts_used'] < subscription?.company?.trail_limit['job_post_limit'])
         if(subscription.company?.usage_stats['job_posts_used'] < subscription?.company?.trail_limit['job_post_limit']) {
           ref.current.job = true
         }
          
      } else {
        const currentTime = Date.now();
        const endTime = new Date(subscription?.subscription?.end_date).getTime()
          if(currentTime >= endTime) {
             ref.current.message = true;
             ref.current.job = true;
          }
      }
  
      return { job: ref.current.job, message: ref.current.message }

    }, [subscription]);
  };