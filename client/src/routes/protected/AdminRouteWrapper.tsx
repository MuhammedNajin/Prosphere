import { useCurrentUser } from "@/hooks/useSelectors";
import { UserRole } from "@/types/user";
import React from "react";
import { Navigate } from "react-router-dom";


interface AdminRouteWrapperProps {
  children: React.ReactNode,
}

const AdminRouteWrapper: React.FC<AdminRouteWrapperProps> = (props) => {
    
    const { children } = props
    const user = useCurrentUser()
    console.log("user", user);
    
     if(user?.role === UserRole.Admin) {

        return children

     } else {
       return <Navigate replace to="/admin/signin" />
     }
    
    
}


export default AdminRouteWrapper;