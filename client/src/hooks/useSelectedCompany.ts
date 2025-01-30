import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export function useSelectedCompany() {
    const { selectedCompany } = useSelector((state: RootState) => state.company);
    return selectedCompany; 
}