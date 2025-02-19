import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import Dropdown from "./DropDown";
import { useGetUser } from "@/hooks/useGetUser";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "@/context/socketContext";
import { NotificationAttrs } from "@/types/notification";
import { cn } from "@/lib/utils";
import { ToastAction } from "@/components/ui/toast";
import SearchWithSuggestions from "./Search";
import { useQuery } from "react-query";
import { NotificationApi } from "@/api/Notification.api";

const Header = () => {
  const [count, setCount] = useState(0);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const user = useGetUser();
  const isLoggedIn = user ?? null;
  const navigate = useNavigate();
  const { toast } = useToast();

  const { notificationSocket } = useContext(SocketContext);

  const { data } = useQuery({
     queryKey: ['unread-notification'],
     queryFn: () => NotificationApi.getNotificationCount(user?._id!)
  })

  useEffect(() => {
    if (data) {
      setCount(data);
      if (data > 0) setHasNewNotification(true);
    }
  }, [data]);
   
  useEffect(() => {
    notificationSocket?.on("notification:sent", (data: NotificationAttrs) => {
      setCount((prev) => prev + 1);
      setHasNewNotification(true);
      
      toast({
        title: data.title,
        description: data.message,
        className: cn(
          "top-0 right-0 flex fixed md:max-w-2xl md:top-4 md:right-4"
        ),
        action: (
          <ToastAction
            onClick={() => navigate("/notification")}
            altText="View notification"
          >
            View
          </ToastAction>
        ),
      });
    });
    
    return () => {
      notificationSocket?.off("notification:sent");
    };
  }, [notificationSocket?.connected, navigate]);

  const handleNotificationClick = () => {
    setHasNewNotification(false);
    navigate("/notification");
  };

  return (
    <header className="flex fixed w-full md:max-w-[80%] z-50 flex-wrap gap-4 justify-between items-center px-6 py-4 bg-white max-md:px-5 border-b shadow-sm border-solid">
      <div className="flex-1 max-w-xl px-4">
        <SearchWithSuggestions />
      </div>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <div className="flex gap-x-4 items-center">
            <button 
              className={cn(
                "relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
                "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-200"
              )}
              onClick={handleNotificationClick}
              aria-label={`${count} unread notifications`}
            >
              <Bell 
                size={22} 
                className={cn(
                  "text-gray-700 transition-all duration-300",
                  hasNewNotification && "text-orange-600"
                )} 
              />
              
              {count > 0 && (
                <span className={cn(
                  "absolute -top-1 -right-1 flex items-center justify-center",
                  "min-w-5 h-5 px-1 text-xs font-bold text-white rounded-full",
                  "bg-orange-600 shadow-sm",
                  hasNewNotification && "animate-pulse"
                )}>
                  {count > 99 ? '99+' : count}
                </span>
              )}
              
              {hasNewNotification && (
                <span className="absolute inset-0 rounded-full animate-ping-slow bg-orange-400 opacity-30"></span>
              )}
            </button>
            <Dropdown />
          </div>
        ) : (
          <div className="flex gap-3">
            <Button
              onClick={() => navigate("/signin")}
              variant="ghost"
              className="rounded-full px-6 border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium transition-all duration-200"
            >
              Sign In
            </Button>
            <Button 
             onClick={() => navigate("/signUp")}
             className="rounded-full px-6 bg-orange-600 text-white hover:bg-orange-700 font-medium shadow-sm hover:shadow-md transition-all duration-200">
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};


export default Header;