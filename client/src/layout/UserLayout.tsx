import NavBar from "../components/common/navBar/NavBar";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";

const UserLayout: React.FC = () => {
  const [sideBar, ] = useState(false);
  return (
    <>
      <div className="flex px-1">
        <div
          className={`fixed h-sreen bg-gray-100 shadow-sm -translate-x-full md:relative border-r md:translate-x-0 md:block z-50 transition-transform duration-300 ease-in-out  ${
            sideBar && "translate-x-0"
          }`}
        >
        </div>
        <div className="flex-1 bg-white h-screen overflow-y-auto">
          <NavBar />
          <div className="max-w-[95%] p-4 mt-16 mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserLayout;
