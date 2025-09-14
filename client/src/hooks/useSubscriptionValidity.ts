import { useCallback } from "react";
import { PaymentApi } from "@/api/Payment.api";

type Plan = { endDate?: string | null; jobsAllowed?: number; jobsUsed?: number; };

export const useSubscriptionValidity = () => {
  const check = useCallback(async (companyId?: string | null) => {
    if (!companyId) return { job: false };
    try {
      const response: Plan | null = await PaymentApi.getCurrentPlan(companyId);
      if (!response) return { job: false };
      const jobsAllowed = Number(response.jobsAllowed ?? 0);
      const jobsUsed = Number(response.jobsUsed ?? 0);
      const endDate = response.endDate ? new Date(response.endDate) : null;
      const now = new Date();
      return { job: jobsAllowed > jobsUsed && endDate !== null && endDate > now };
    } catch (err) {
      console.error("useSubscriptionValidity.check error:", err);
      return { job: false };
    }
  }, []);

  return { check };
};
