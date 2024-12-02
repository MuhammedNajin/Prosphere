import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Dropdown from "./DropDown";
import { useGetUser } from "@/hooks/useGetUser";

const Header = () => {
  const user = useGetUser()
  const isLoggedIn = user ?? null

  return (
    <header className="flex overflow-hidden fixed w-full md:max-w-[80%] z-50 flex-wrap gap-4 justify-between items-center px-6 py-4 bg-white max-md:px-5 border-b shadow-sm border-solid">
      {/* Logo */}
      <div className="flex items-center gap-2">
       
      </div>

      {/* Search Bar */}
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

      {/* Auth Buttons or User Dropdown */}
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <Dropdown />
        ) : (
          <div className="flex gap-3">
            <Button
              variant=""
              className="rounded-full px-6 border bg-white border-orange-700 font-semibold text-orange-700 hover:bg-orange-700 hover:text-white"
            >
              Sign In
            </Button>
            <Button
              className="rounded-full px-6 bg-orange-700 font-semibold  hover:bg-white hover:text-orange-700 hover:border hover:border-orange-700"
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;