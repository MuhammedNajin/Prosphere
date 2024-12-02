import { useSelector } from "react-redux";


export const useProfile = () => {
   const { resume } = useSelector((state) => state.auth);
   return resume;
}