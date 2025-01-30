import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Admin/User/AppSidebat";
import { Outlet } from "react-router-dom";
import Topbar from "@/components/Admin/User/Topbar";

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <Topbar onMenuClick={() => {}} />
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
