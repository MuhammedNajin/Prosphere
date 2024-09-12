import { Plus } from "lucide-react";
import React from "react";

const StoryItem: React.FC<{ isAdd?: boolean; label: string }> = ({ isAdd, label }) => (
    <div className="flex flex-col items-center space-y-1">
      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
        {isAdd ? <Plus size={24} /> : <img src="Loginpage.image.png" alt={label} className="w-full h-full rounded-full object-cover" />}
      </div>
      <span className="text-xs">{label}</span>
    </div>
  );

  export default StoryItem
