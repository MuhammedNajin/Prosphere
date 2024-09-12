import { Bookmark, Heart, MessageSquare, Share2 } from "lucide-react";
import React from "react";


const Post: React.FC = () => (
    <div className="bg-white rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <img src="Loginpage.image.png" alt="Muhammed Najin N" className="w-10 h-10 rounded-full" />
          <div>
            <h3 className="font-medium">Muhammed Najin N</h3>
            <p className="text-xs text-gray-500">Mern stack developer</p>
            <p className="text-xs text-gray-500">1 day ago</p>
          </div>
        </div>
        <button className="text-gray-500">⋯</button>
      </div>
      <img src="https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Post content" className="w-full rounded-lg mb-4" />
      <div className="flex items-center justify-between text-gray-500 mb-4">
        <div className="flex items-center space-x-2">
          <Heart size={20} />
          <span className="text-sm">100 likes</span>
        </div>
        <div className="flex items-center space-x-2">
          <MessageSquare size={20} />
          <span className="text-sm">7 Comments</span>
        </div>
        <Share2 size={20} />
        <Bookmark size={20} />
      </div>
      <input
        type="text"
        placeholder="Add a comment"
        className="w-full bg-gray-100 rounded-full px-4 py-2 text-sm"
      />
    </div>
  );

  export default Post