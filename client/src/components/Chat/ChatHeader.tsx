import React, { useState } from 'react';
import { MoreVertical, Phone, Search } from 'lucide-react';
import { ROLE, SelectedConversation } from "@/types/chat";
import { useGetUser } from "@/hooks/useGetUser";

import { formatDateTime } from '@/lib/utilities/calculateDuration';

interface ChatHeaderProps {
  conversation: SelectedConversation;
  typing: boolean;
  online: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ conversation, typing, online }) => {
  const user = useGetUser();
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = () => {
    return online ? 'bg-green-500' : 'bg-gray-400';
  };

  return (
    <div className="h-14 md:h-16 flex items-center justify-between px-4 border-b border-gray-200 bg-white shadow-sm relative">
  
      <div className="flex items-center flex-1 min-w-0">
        <div className="relative">
          <img
            src={conversation.avatar || "/profileIcon.png"}
            alt="Profile"
            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-gray-100 hover:border-orange-300 transition-all duration-200 shadow-sm"
          />
          <div className={`absolute bottom-0 right-0 w-3 h-3 md:w-3.5 md:h-3.5 ${getStatusColor()} rounded-full border-2 border-white`} />
        </div>
        
        <div className="ml-3 flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h2 className="font-semibold text-sm md:text-base text-gray-900 truncate">
              {conversation.context === ROLE.COMPANY && conversation.company.owner !== user?._id 
                ? `${conversation.company?.name} (${conversation.name})` 
                : conversation.name}
            </h2>
            {true && (
              <span className="flex-shrink-0 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {typing ? (
              <p className="text-xs md:text-sm text-orange-600 animate-pulse">
                typing...
              </p>
            ) : (
              <p className="text-xs md:text-sm text-gray-500">
                {!online ? `Last seen ${formatDateTime(conversation.lastSeen ?? new Date())}` : 'Online'}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-1 md:space-x-2">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
          <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
          <Phone className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
        </button>
        <div className="relative">
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            onClick={() => setShowActions(!showActions)}
          >
            <MoreVertical className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
          </button>
          
          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 text-gray-700">
                View Profile
              </button>
              <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 text-gray-700">
                Mute Notifications
              </button>
              <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 text-red-600">
                Block User
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;