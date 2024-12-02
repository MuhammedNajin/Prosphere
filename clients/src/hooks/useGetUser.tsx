import { useSelector } from "react-redux";


export const useGetUser = () => {
   const { user } = useSelector((state) => state.auth);
   return user;
}