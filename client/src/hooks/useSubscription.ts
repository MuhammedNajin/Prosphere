import { PaymentApi } from "@/api/Payment.api";
import { SubscriptionData } from "@/types/subscription";
import { useQuery } from "react-query";

export const useSubscription = (companyId: string) => {
  return useQuery<SubscriptionData | null>({
    queryKey: ["subscription", companyId],
    queryFn: async () => {
      if (!companyId) return null;
      return await PaymentApi.getCurrentPlan(companyId);
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
