import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";


export const useResume = () => {
   const { resume } = useSelector((state: RootState) => state.user);
   return resume;
}