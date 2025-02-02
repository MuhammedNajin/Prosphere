import { Calendar, Home, Inbox, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { adminLogoutThuck } from "@/redux/action/actions";
import { AppDispatch } from "@/redux/store";
import Logo from "@/components/common/Logo/Logo";
import { TbPremiumRights } from "react-icons/tb";

const items = [
  {
    title: "Home",
    url: "/admin/dashboard",
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
    icon: TbPremiumRights,
  },
];

const AppSidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const logoutHandler = () => {
    dispatch(adminLogoutThuck())
      .unwrap()
      .then(() => {
        navigate("/admin/signin");
      });
  };

  return (
    <div className="flex h-full min-h-screen w-20 flex-col bg-white shadow-lg">
      {/* Logo */}
      <div className="p-4">
        <Logo />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col flex-1 gap-y-2 px-2 py-4">
        {items.map((item) => {
          const isActive = location.pathname === item.url;
          const Icon = item.icon;

          return (
            <Link
              key={item.url}
              to={item.url}
              className={`flex flex-col items-center justify-center rounded-lg p-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-orange-50 text-orange-600 shadow-md"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon
                className={`h-6 w-6 ${
                  isActive ? "text-orange-600" : "text-gray-400"
                }`}
              />
          
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="border-t border-gray-200 p-4">
        <button
          onClick={logoutHandler}
          className="flex w-full flex-col items-center justify-center rounded-lg p-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        >
          <LogOut className="h-6 w-6 text-gray-400" />
          <span className="text-xs">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AppSidebar;
