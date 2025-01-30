import { RootState } from "@/redux/store";
import {  SubscriptionData } from "@/types/subscription";
import { useSelector } from "react-redux";

export function useSubscription(): SubscriptionData | null {
    const { selectedCompanySubscription } = useSelector((state: RootState) => state.company);
    return selectedCompanySubscription; 
}