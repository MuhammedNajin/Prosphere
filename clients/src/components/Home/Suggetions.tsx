import React from "react";


const Suggestions: React.FC = () => (
    <aside className="w-64 bg-white rounded-lg p-4">
      <h2 className="font-semibold mb-4">Suggestions for you</h2>
      {/* {[1, 2].map((i) => (
        <div key={i} className="flex items-center space-x-2 mb-4">
          <img src="/api/placeholder/48/48" alt="Suggested user" className="w-12 h-12 rounded-lg" />
          <div>
            <h3 className="font-medium">K. M</h3>
            <button className="bg-black text-white text-xs px-3 py-1 rounded-full mt-1">
              Connect
            </button>
          </div>
        </div>
      ))} */}
    </aside>
  );

  export default Suggestions;