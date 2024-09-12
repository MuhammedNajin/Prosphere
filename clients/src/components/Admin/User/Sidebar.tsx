import React from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold">LOGO</h1>
        </div>
        <nav className="mt-10">
          <a className="block py-2.5 px-4 hover:bg-gray-700" href="#">
            Dashboard
          </a>
          <a className="block py-2.5 px-4 hover:bg-gray-700" href="#">
            Users
          </a>
          <a className="block py-2.5 px-4 hover:bg-gray-700" href="#">
            Company
          </a>
          <a className="block py-2.5 px-4 hover:bg-gray-700" href="#">
            Jobs
          </a>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;