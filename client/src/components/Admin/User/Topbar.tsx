import React from "react";
import { Bell, Search, Sun } from "lucide-react";

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar: React.FC<TopbarProps> = () => {
  return (
    <div className="bg-white border-b px-6 py-4">
      <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
        {/* Left Section */}
        <div className="flex items-center gap-8">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Welcome back, Admin!</h1>
            <p className="text-sm text-gray-500 mt-0.5">Let's make today count</p>
          </div>
          
          <div className="hidden lg:flex items-center bg-gray-50 rounded-full px-4 py-2">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none outline-none px-3 text-sm w-64 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Sun size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>

          {/* Admin Profile */}
          <div className="flex items-center gap-4 border-l pl-6">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">Admin123@gmail.com</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
              <span className="text-white font-medium text-sm">A</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topbar;