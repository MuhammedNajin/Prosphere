import { CompanyUsageData, SubscriptionData } from "@/types/subscription";
import { useSelector } from "react-redux";

export function useSubscription(): { subscription: SubscriptionData, company: CompanyUsageData, isTrail: boolean } {
    const { selectedCompanySubscription } = useSelector((state) => state.company);
    return selectedCompanySubscription; 
}