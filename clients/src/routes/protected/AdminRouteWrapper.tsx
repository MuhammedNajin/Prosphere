import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";


interface AdminRouteWrapperProps {
  children: React.ReactNode,
}

const AdminRouteWrapper: React.FC<AdminRouteWrapperProps> = (props) => {
    
    const { children } = props
    const { user } = useSelector((state) => state.auth);
    console.log("user", user);
    
     if(user) {

        return children

     } else {
       return <Navigate replace to="/admin/singin" />
     }
    
    
}


export default AdminRouteWrapper;