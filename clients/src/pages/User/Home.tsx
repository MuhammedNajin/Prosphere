import React from "react";

const Home: React.FC = () => {

  return (
    
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/5 bg-white p-6">
        {/* User Profile */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/path-to-profile-pic"
            alt="Profile"
            className="rounded-full w-16 h-16 mb-2"
          />
          <h2 className="font-semibold">Muhammed Najin N</h2>
          <p className="text-gray-500 text-sm">Mern stack developer</p>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-4">
          <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-200">
            <i className="icon-home mr-4"></i>
            <span>Home</span>
          </a>
          <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-200">
            <i className="icon-connections mr-4"></i>
            <span>My connections</span>
          </a>
          <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-200">
            <i className="icon-jobs mr-4"></i>
            <span>Jobs</span>
          </a>
          <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-200">
            <i className="icon-talk mr-4"></i>
            <span>Talk</span>
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header (Search and Icons) */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Job Portal</h1>
          <div className="flex space-x-4 items-center">
            <input
              type="text"
              className="bg-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none"
              placeholder="Search"
            />
            <i className="icon-add"></i>
            <i className="icon-bell"></i>
            <i className="icon-user"></i>
          </div>
        </header>

        {/* Stories */}
        <div className="flex space-x-4 overflow-x-scroll mb-6">
          <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gray-200">Your story</div>
          <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gray-200">Shafeeq</div>
          {/* Repeat for other stories */}
        </div>

        {/* Post */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex items-center mb-4">
            <img
              src="/path-to-profile-pic"
              alt="User"
              className="rounded-full w-12 h-12 mr-4"
            />
            <div>
              <h3 className="font-semibold">Muhammed Najin N</h3>
              <p className="text-gray-500 text-sm">2 days ago</p>
            </div>
          </div>
          <img
            src="/path-to-post-image"
            alt="Post Content"
            className="rounded-lg mb-4"
          />
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <span>💖 100 likes</span>
              <span>💬 7 comments</span>
            </div>
            <i className="icon-bookmark"></i>
          </div>
        </div>
      </div>

      {/* Right Sidebar (Suggestions) */}
      <div className="w-1/5 bg-white p-6">
        <h2 className="font-semibold mb-6">Suggestions for you</h2>
        {/* Suggestion Card */}
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <img
            src="/path-to-profile-pic"
            alt="Suggested User"
            className="rounded-full w-12 h-12 mb-2"
          />
          <h3 className="font-semibold">K. M</h3>
          <button className="bg-blue-500 text-white rounded-full px-4 py-2 mt-2">
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
