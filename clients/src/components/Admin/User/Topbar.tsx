import React from "react";

const Topbar: React.FC = () => {
  return (
    <div className="bg-white p-4 shadow-md flex justify-between">
      <div>
        <p className="text-lg">Hello, Lekan</p>
        <p className="text-sm text-gray-500">Have a nice day</p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-sm">
          <p>Lekan Okeowo</p>
          <p className="text-gray-400">Admin</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-gray-300" />
      </div>
    </div>
  );
}

export default Topbar;
