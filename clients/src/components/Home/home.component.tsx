import React from 'react';
import { Bell, Home, MessageSquare, Briefcase, Users, DollarSign, Building2, Plus, MoreVertical, Heart, Send, Bookmark } from 'lucide-react';

const JobPortal = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white p-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold">Job Portal</h1>
        <div className="flex items-center space-x-4">
          <input type="text" placeholder="Search" className="border rounded-full px-4 py-2 w-64" />
          <Plus className="w-6 h-6" />
          <Bell className="w-6 h-6" />
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white h-screen p-4 flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-purple-500 rounded-full"></div>
            <span className="font-semibold">Muhammed Najin N</span>
          </div>
          <button className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>
          <button className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
            <Users className="w-5 h-5" />
            <span>My connections</span>
            <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs ml-auto">3</span>
          </button>
          <button className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
            <Briefcase className="w-5 h-5" />
            <span>Jobs</span>
            <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs ml-auto">2</span>
          </button>
          <button className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
            <MessageSquare className="w-5 h-5" />
            <span>Talk</span>
            <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs ml-auto">1</span>
          </button>
          <button className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
            <DollarSign className="w-5 h-5" />
            <span>Get Premium</span>
          </button>
          <button className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
            <Building2 className="w-5 h-5" />
            <span>My companies</span>
          </button>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4">
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <Plus className="w-8 h-8 text-gray-500" />
                </div>
                <span className="text-sm mt-1">Your story</span>
              </div>
              {[...Array(7)].map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-full"></div>
                  <span className="text-sm mt-1">Shafeeq</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div>
                    <h3 className="font-semibold">Muhammed Najin N</h3>
                    <p className="text-sm text-gray-500">Mern stack developer</p>
                    <p className="text-xs text-gray-400">2 days ago</p>
                  </div>
                </div>
                <MoreVertical className="w-5 h-5 text-gray-500" />
              </div>
            </div>
            <div className="p-4">
              <img src="/api/placeholder/800/400" alt="Login UI" className="w-full rounded-lg" />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex space-x-4">
                <button className="flex items-center space-x-1 text-gray-500">
                  <Heart className="w-5 h-5" />
                  <span>100 likes</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500">
                  <MessageSquare className="w-5 h-5" />
                  <span>7 comments</span>
                </button>
              </div>
              <div className="flex space-x-2">
                <Send className="w-5 h-5 text-gray-500" />
                <Bookmark className="w-5 h-5 text-gray-500" />
              </div>
            </div>
            <div className="px-4 pb-4">
              <input type="text" placeholder="Add a comment" className="w-full border-b pb-2 focus:outline-none" />
            </div>
          </div>
        </main>

        {/* Right sidebar */}
        <aside className="w-64 p-4">
          <h2 className="font-semibold mb-4">Suggestions for you</h2>
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-purple-500 rounded-full"></div>
                <div>
                  <h3 className="font-semibold">K. M</h3>
                  <button className="text-sm text-blue-500">Connect</button>
                </div>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
};

export default JobPortal;