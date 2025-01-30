import { useSelector } from "react-redux";


export const useResume = () => {
   const { resume } = useSelector((state) => state.auth);
   return resume;
}