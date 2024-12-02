import { SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSubButton, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/Admin/User/AppSidebat"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronUp, User2 } from "lucide-react"
import { Outlet } from "react-router-dom"
import Topbar from "@/components/Admin/User/Topbar"

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <Topbar />
        <SidebarTrigger />
        <Outlet />
      </main>
      
    </SidebarProvider>
  )
}
