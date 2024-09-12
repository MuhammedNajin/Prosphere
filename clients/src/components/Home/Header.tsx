import { Bell, Plus, Search, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutThuck } from "../../redux";
import { useEffect } from "react";

const Header: React.FC = () => {

   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { user } = useSelector((state) => state.auth);
   console.log("user", user)
     const logoutHandler = () => {
          dispatch(logoutThuck())
          .unwrap()
          .then(() => {
             navigate('/login')
          })
     }

    return (
        <header className="bg-white p-4 flex justify-between items-center border-b">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold">Job Portal</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-100 pl-10 pr-4 py-2 rounded-full w-64"
          />
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <Plus size={24} />
        <Bell size={24} />
        <User size={24} />
       { user &&  <button onClick={logoutHandler} className="bg-red-600 text-white px-4 py-2 rounded-md text-sm">Logout</button>}
      </div>
    </header>
    )
}

  export default Header;