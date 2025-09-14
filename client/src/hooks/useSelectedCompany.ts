import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export function useCurrentCompany() {
    const { currentCompany } = useSelector((state: RootState) => state.company);
    return currentCompany; 
}