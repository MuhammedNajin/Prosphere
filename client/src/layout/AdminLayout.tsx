import React from 'react';
import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/Admin/User/AppSidebat";
import Topbar from "@/components/Admin/User/Topbar";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar onMenuClick={() => {}} />
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}