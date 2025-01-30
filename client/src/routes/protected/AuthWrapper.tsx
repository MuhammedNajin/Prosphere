import { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface UserRouteWrapperProps {
   children: React.ReactNode
}


const AuthRouteWrapper: React.FC<UserRouteWrapperProps> = (props) => {
      
    const { children } = props
    const { user } = useSelector((state: RootState) => state.auth);
    console.log("user", user);
    
     if(!user) {

        return children

     } else {
       return <Navigate replace to="/" />
     }
}

export default AuthRouteWrapper