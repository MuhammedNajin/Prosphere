import { Bell, Menu, Plus, Search, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutThuck } from "../../../redux";
import { useEffect, useState } from "react";
import { Dropdown } from "./DropDown";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";

interface NavbarProps {
  setSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  sideBar: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ setSidebar, sideBar, setModal }) => {
  const [state, setState] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  console.log("user", user);

  const handleSideBar = () => {
    console.log("clicked", state);
    // setState(!state)
    setSidebar(!sideBar);
  };
  return (
    <header className="bg-white py-2 px-7 pr-8  flex justify-between items-center border-b">
      <div className="flex items-center gap-x-4 md:gap-x-0 py-2">
        <div className="px-2 md:px-0">
          <Menu size={25} onClick={handleSideBar} className="md:hidden" />
        </div>
        <div className="md:mr-4">
          <h1 className="text-xl font-bold">Job Portal</h1>
        </div>

        <div className="relative">
          <div className="hidden md:block">
            <input
              type="text"
              className="w-full hidden md:block pl-10 pr-5 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
              placeholder="Search"
              value="Search"
              onChange={(e) => {}}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <Search className="md:hidden h-5 w-5 text-gray-400" />
        <div className="hidden md:block">
        <Button
          className="bg-orange-600 text-white border border-orange-500 hover:bg-orange-600 hover:text-white rounded-none inline-flex gap-x-2 shadow"
          onClick={(e) => setModal(true)}
        >
          <FaPlus />
          Create job
        </Button>
      </div>
        <Bell size={24} className="hidden md:block" />
        <Dropdown setModal={setModal}/>
      </div>
    </header>
  );
};

export default Navbar;
