import Logo from "@/components/common/Logo/Logo";
import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout: React.FC = () => {
  return (
    <div className="relative">
      <header className="flex bg-white absolute z-50 w-full items-center justify-between gap-2 self-start  max-md:ml-2.5  tracking-tight text-gray-800 py-4 shadow-md  px-8    ">
        <div className="flex gap-2.5 items-center text-2xl font-bold">
          <Logo />
          <h1 className="basis-auto">Prosphere</h1>
        </div>
        {/* <div className="flex gap-x-2 text-lg font-bold text-orange-700">
          <button>Job seeker</button>
          <span className="w-[2px] bg-orange-700 font-normal rotate-25"></span>
          <button>Employer</button>
        </div> */}
      </header>
      <div className="pt-16">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
