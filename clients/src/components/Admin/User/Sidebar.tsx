import React from "react";

function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen">
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold">YOURLOGO</h1>
      </div>
      <nav className="mt-10">
        <a className="block py-2.5 px-4 hover:bg-gray-700" href="#">
          Dashboard
        </a>
        <a className="block py-2.5 px-4 hover:bg-gray-700" href="#">
          Users
        </a>
        <a className="block py-2.5 px-4 hover:bg-gray-700" href="#">
          Documents
        </a>
        <a className="block py-2.5 px-4 hover:bg-gray-700" href="#">
          Photos
        </a>
        <a className="block py-2.5 px-4 hover:bg-gray-700" href="#">
          Hierarchy
        </a>
        <a className="block py-2.5 px-4 hover:bg-gray-700" href="#">
          Message
        </a>
        <a className="block py-2.5 px-4 hover:bg-gray-700" href="#">
          Help
        </a>
        <a className="block py-2.5 px-4 hover:bg-gray-700" href="#">
          Setting
        </a>
      </nav>
    </div>
  );
}

export default Sidebar;
