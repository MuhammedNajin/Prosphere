import React from "react";
import { adminLogoutThuck } from "@/redux/reducers/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

 

  return (
    <div className="bg-white p-4 shadow-md flex justify-between items-center">
      <button
        className="lg:hidden text-gray-600"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="hidden sm:block">
        <p className="text-lg">Hello, Admin</p>
        <p className="text-sm text-gray-500">Have a nice day</p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-sm hidden sm:block">
          <p>Admin123@gmail.com</p>
          <p className="text-gray-400">Admin</p>
        </div>
      
      </div>
    </div>
  );
}

export default Topbar;