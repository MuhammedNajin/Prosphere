import React from 'react';
import { Search, MapPin, BellDot } from 'lucide-react';
import { Separator } from "@/components/ui/separator"


const JobSearch = () => {
  const popularSearches = ['UI Designer', 'UX Researcher', 'Android', 'Admin'];

  return (
    <div className="max-w-7xl px-8 py-4">
      {/* <div className="flex items-center justify-between pb-8 border-b">
        <h1 className="text-4xl font-clash   font-bold text-navy-900">Find Jobs</h1>
        <div className="flex items-center gap-4">
          <button className="relative">
            <BellDot className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div> */}

      <div className="bg-white rounded-sm  p-6 my-5 border">
        <div className="flex flex-1 gap-4">
          <div className="flex flex-1 gap-x-4 relative">
            <div className="flex flex-row items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Job title or keyword"
              className="w-full  pr-4 py-3 border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <Separator orientation='vertical' />
          <div className="flex flex-1 gap-x-4 relative">
            <div className="flex flex-row items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Florence, Italy"
              className="w-full  pr-4 py-3 border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <button className="px-8 py-3 bg-orange-500 text-white font-bold rounded hover:bg-orange-700 transition-colors">
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobSearch;