import { useCurrentUser } from "@/hooks/useSelectors";
import { UserRole } from "@/types/user";
import React from "react";
import { Navigate } from "react-router-dom";

interface UserRouteWrapperProps {
   children: React.ReactNode
}


const AuthRouteWrapper: React.FC<UserRouteWrapperProps> = (props) => {
      
    const { children } = props
    const user = useCurrentUser()
    console.log("user", user);
    
     if(user?.role == UserRole.None) {

        return children

     } else {
       return <Navigate replace to="/" />
     }
}

export default AuthRouteWrapper