import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Dropdown from "./DropDown";
import { useGetUser } from "@/hooks/useGetUser";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "@/context/socketContext";
import { NotificationAttrs } from "@/types/notification";
import { cn } from "@/lib/utils";
import { ToastAction } from "@/components/ui/toast";

const Header = () => {
  const [count, setCount] = useState(0);
  const user = useGetUser();
  const isLoggedIn = user ?? null;
  const navigate = useNavigate();
  const { toast } = useToast();

  const { notificationSocket } = useContext(SocketContext);

  useEffect(() => {
    notificationSocket?.on("notification:sent", (data: NotificationAttrs) => {
      console.log("notification:sent", data);
      setCount((prev) => prev + 1);
      toast({
        title: data.title,
        description: data.message,
        className: cn(
          "top-0 right-0 flex fixed md:max-w-2xl md:top-4 md:right-4"
        ),
        action: (
          <ToastAction
            onClick={() => console.log("clicked")}
            altText="Try again"
          >
            See more...
          </ToastAction>
        ),
      });
    });
  }, [notificationSocket?.connected]);

  return (
    <header className="flex overflow-hidden fixed w-full md:max-w-[80%] z-50 flex-wrap gap-4 justify-between items-center px-6 py-4 bg-white max-md:px-5 border-b shadow-sm border-solid">
      <div className="flex-1 max-w-xl px-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-50 focus:bg-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <div className="flex gap-x-2 items-center">
            <div className="relative" onClick={() => navigate("/notification")}>
              {count > 0 && (
                <span className="absolute -top-2 -right-1 bg-orange-700 rounded-full px-1 text-white">
                  {count}
                </span>
              )}
              <Bell size={25} />
            </div>
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
