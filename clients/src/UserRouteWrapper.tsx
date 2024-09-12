import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";


const UserRouteWrapper: React.FC = (props) => {
      
    const { children } = props
    const { user } = useSelector((state) => state.auth);
    console.log("user", user);
    
     if(!user) {

        return children

     } else {
       return <Navigate replace to="/" />
     }
}

export default UserRouteWrapper