import {
  Calendar,
  ChevronUp,
  Home,
  Inbox,
  LogOut,
  Search,
  User2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { adminLogoutThuck } from "@/redux/action/actions";
import { AppDispatch } from "@/redux/store";

const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "User",
    url: "/admin/user",
    icon: Inbox,
  },
  {
    title: "Company",
    url: "/admin/company/verification",
    icon: Calendar,
  },
  {
    title: "Subscription",
    url: "/admin/subscription",
    icon: Search,
  },
];

export function AppSidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(adminLogoutThuck())
      .unwrap()
      .then(() => {
        navigate("/admin/signin");
      });
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuSubButton>
                  <User2 /> Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuSubButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width] bg-gray-300 rounded-lg "
              >
                <DropdownMenuItem className=" text-red-600">
                  <button
                    className="flex items-center p-2 gap-2.5"
                    onClick={logoutHandler}
                  >
                    <LogOut size={20} />
                    <span>Sign out</span>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
