import { useSelector } from "react-redux";

export function useSelectedCompany() {
    const { selectedCompany } = useSelector((state) => state.company);
    return selectedCompany; 
}