import { UserState } from "@/redux/reducers/userSlice";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

// Custom hook for accessing user state
export const useUser = () => {
  return useSelector((state: RootState) => state.user);
};

export const useCurrentUser = (): UserState | null => {
  return useSelector((state: RootState) => state.user);
};

export const useCompanies = () => {
  return useSelector((state: RootState) => state.company.companies);
}