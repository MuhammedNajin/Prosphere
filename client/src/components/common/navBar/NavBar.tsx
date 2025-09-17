import { cn } from "@/lib/utils";
import { Home, MessageCircle, Briefcase, Users, Building, Bell, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import Dropdown from "./DropDown";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { NotificationApi } from "@/api/Notification.api";
import { useCurrentUser } from "@/hooks/useSelectors";

const navItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: MessageCircle, label: "Messages", path: "/chat" },
  { icon: Briefcase, label: "Jobs", path: "/jobs" },
  { icon: Users, label: "My Application", path: "/myapplication" },
  { icon: Building, label: "My Companies", path: "/mycompany" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("/");
  const navigate = useNavigate()
  const user = useCurrentUser()

  // Fixed the useQuery implementation
  const { data } = useQuery({
     queryKey: ['notificationcount', user?.id],
     queryFn: () => NotificationApi.getNotificationCount(user?.id!),
     enabled: !!user?.id,
  })

  useEffect(() => {
    console.log(data, "notification count")
  })

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: any) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleNavClick = (path: string) => {
    setActiveTab(path);
    setIsOpen(false);
    navigate(path);
  };

  return (
    <>
      <nav 
        className={cn(
          "fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md border-b transition-all duration-300 z-50",
          scrolled 
            ? "shadow-lg border-gray-200/50" 
            : "shadow-sm border-gray-100"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Enhanced Logo */}
            <div className="flex items-center gap-3 font-bold text-xl cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg blur opacity-30"></div>
                <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-2.5 rounded-lg">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                JobPortal
              </span>
            </div>

            {/* Enhanced Desktop Navigation - Vertical Icon + Text Layout */}
            <ul className="hidden md:flex items-center gap-2">
              {navItems.map(({ icon: Icon, label, path }) => (
                <li key={label}>
                  <button
                    onClick={() => handleNavClick(path)}
                    className={cn(
                      "group relative flex flex-col items-center justify-center px-4 py-3 rounded-xl text-xs font-medium transition-all duration-300",
                      "hover:scale-105 active:scale-95 min-w-[80px]",
                      activeTab === path
                        ? "text-white bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/25"
                        : "text-gray-600 hover:text-orange-600 hover:bg-orange-50/80"
                    )}
                  >
                    <Icon className={cn(
                      "h-5 w-5 mb-1 transition-all duration-300 group-hover:scale-110",
                      activeTab === path ? "drop-shadow-sm" : ""
                    )} />
                    <span className="leading-tight text-center">{label}</span>
                    
                    {/* Active indicator dot */}
                    {activeTab === path && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
                    )}
                    
                    {/* Hover indicator */}
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  </button>
                </li>
              ))}
            </ul>

            {/* Enhanced Actions */}
            <div className="flex items-center gap-4">
              {/* Enhanced Notification Bell - Now uses dynamic count from API */}
              <div className="relative group">
                <button onClick={() => navigate('/notification')} className="relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-200 hover:bg-orange-50 hover:scale-110 active:scale-95">
                  <Bell className="h-5 w-5 text-gray-700 group-hover:text-orange-600 transition-colors" />
                  {data > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 text-xs flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-medium shadow-lg animate-pulse">
                      {data> 99 ? '99+' : data}
                    </span>
                  )}
                </button>
              </div>

              <Dropdown />

              {/* Enhanced Mobile Menu Button */}
              <button
                className="md:hidden relative p-2.5 rounded-lg hover:bg-orange-50 transition-all duration-200 hover:scale-110 active:scale-95"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                <div className="relative w-6 h-6">
                  <Menu 
                    className={cn(
                      "absolute inset-0 h-6 w-6 text-gray-700 transition-all duration-300",
                      isOpen ? "rotate-180 opacity-0" : "rotate-0 opacity-100"
                    )} 
                  />
                  <X 
                    className={cn(
                      "absolute inset-0 h-6 w-6 text-gray-700 transition-all duration-300",
                      isOpen ? "rotate-0 opacity-100" : "-rotate-180 opacity-0"
                    )} 
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Navigation - Vertical Layout */}
        <div 
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-out",
            isOpen 
              ? "max-h-[500px] opacity-100" 
              : "max-h-0 opacity-0"
          )}
        >
          <div className="bg-white/95 backdrop-blur-md border-t border-gray-100">
            <div className="px-4 py-4">
              <div className="grid grid-cols-3 gap-3">
                {navItems.map(({ icon: Icon, label, path }, index) => (
                  <div 
                    key={label}
                    className={cn(
                      "transform transition-all duration-300 ease-out",
                      isOpen 
                        ? "translate-y-0 opacity-100" 
                        : "translate-y-4 opacity-0"
                    )}
                    style={{ 
                      transitionDelay: isOpen ? `${index * 80}ms` : "0ms" 
                    }}
                  >
                    <button
                      onClick={() => handleNavClick(path)}
                      className={cn(
                        "group w-full flex flex-col items-center justify-center p-4 rounded-xl text-xs font-medium transition-all duration-200",
                        "hover:scale-105 active:scale-95",
                        activeTab === path
                          ? "text-white bg-gradient-to-br from-orange-500 to-red-500 shadow-lg"
                          : "text-gray-700 hover:text-orange-600 hover:bg-orange-50/80"
                      )}
                    >
                      <Icon className="h-6 w-6 mb-2 transition-transform group-hover:scale-110" />
                      <span className="leading-tight text-center">{label}</span>
                      
                      {/* Active indicator for mobile */}
                      {activeTab === path && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Navbar;