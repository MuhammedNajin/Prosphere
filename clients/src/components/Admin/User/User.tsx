import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import UserTable from "./UserTable";

const UserComponent: React.FC = () => {

    
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Topbar />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">Users</h1>
          {/* Search bar and statistics */}
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              placeholder="Search"
              className="px-4 py-2 border rounded-md w-1/3"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Add user +</button>
          </div>

          {/* Statistic boxes */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="text-xl font-bold">614</p>
              <p className="text-sm text-gray-500">Lorem ipsum</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="text-xl font-bold">124</p>
              <p className="text-sm text-gray-500">Lorem ipsum</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="text-xl font-bold">504</p>
              <p className="text-sm text-gray-500">Lorem ipsum</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="text-xl font-bold">100</p>
              <p className="text-sm text-gray-500">Lorem ipsum</p>
            </div>
          </div>

          {/* User table */}
          <UserTable />
        </div>
      </div>
    </div>
  );
}

export default UserComponent;
