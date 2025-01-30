import { Search, MapPin } from 'lucide-react';

const JobSearch = () => {
  return (
    <div className="min-h-screen bg-white">
    
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          
          <div className="w-8 h-8 bg-indigo-600 rounded-full"></div>
          <span className="text-xl font-semibold">JobHuntly</span>
        </div>
        
        <div className="flex gap-8">
          <a href="#" className="text-indigo-600 border-b-2 border-indigo-600">Find Jobs</a>
          <a href="#" className="text-gray-600">Browse Companies</a>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-indigo-600">Login</button>
          <button className="px-4 py-2 text-white bg-indigo-600 rounded-lg">Sign Up</button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto mt-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Find your <span className="text-blue-400 relative">
              dream job
              <div className="absolute bottom-1 left-0 w-full h-1 bg-blue-400"></div>
            </span>
          </h1>
          <p className="text-gray-600">
            Find your next career at companies like HubSpot, Nike, and Dropbox
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-2 flex gap-2">

          <div className="flex-1 flex items-center px-4 border-r">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Job title or keyword"
              className="w-full outline-none text-gray-700"
            />
          </div>

          <div className="flex-1 flex items-center px-4">
            <MapPin className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Florence, Italy"
              className="w-full outline-none text-gray-700"
            />
            <button className="ml-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg">
            Search
          </button>
        </div>

        <div className="mt-6 text-gray-600">
          Popular: {' '}
          <span className="text-gray-500">
            UI Designer, UX Researcher, Android, Admin
          </span>
        </div>
      </main>
    </div>
  );
};

export default JobSearch;