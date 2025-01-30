import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout: React.FC = () => {
  return (
    <div className="relative">
      <div className="">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
