import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";


export const useGetUser = () => {
   const { user } = useSelector((state: RootState) => state.auth);
   return user;
}