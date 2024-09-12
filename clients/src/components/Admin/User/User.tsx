import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import UserTable from "./UserTable";

const UserComponent: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <div className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">Users</h1>
          {/* Search bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 space-y-2 sm:space-y-0">
            <input
              type="text"
              placeholder="Search"
              className="px-4 py-2 border rounded-md w-full sm:w-1/2 lg:w-1/3"
            />
          </div>

          {/* User table */}
          <UserTable />
        </div>
      </div>
    </div>
  );
}

export default UserComponent;