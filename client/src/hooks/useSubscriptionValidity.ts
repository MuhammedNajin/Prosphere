import { SubscriptionData } from "@/types/subscription";
import { useMemo, useRef } from "react";
import { useSubscription } from "./useSubscription";

export const useSubscriptionValidity = () => {
  const ref = useRef({
    job: false,
    message: false,
  });
  const subscription: SubscriptionData = useSubscription();

  return useMemo(() => {
    console.log("subscription", subscription);

    if (!subscription) {
      return false;
    }

    if (subscription.isTrail) {
      console.log(
        "tail",
        subscription.usageLimit["jobPostLimit"] <
          subscription?.trailLimit["jobPostLimit"]
      );
      if (
        subscription?.usageLimit['jobPostLimit'] <
        subscription?.trailLimit["jobPostLimit"]
      ) {
        ref.current.job = true;
      }
    } else {
      const currentTime = Date.now();
      const endTime = new Date(subscription?.endDate).getTime();
      console.log("subscriped", currentTime <= endTime, currentTime, endTime, subscription?.endDate)
      if (currentTime <= endTime) {
        ref.current.message = true;
        ref.current.job = true;
      }
    }

    return { job: ref.current.job, message: ref.current.message };
  }, [subscription]);
};
