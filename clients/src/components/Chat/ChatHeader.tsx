import { MessageCircle, MoreVertical, Star } from 'lucide-react'
import React from 'react'


interface ChatHeaderProps {
    conversation: unknown;

}
const ChatHeader: React.FC<ChatHeaderProps> = ({ conversation }) => {
  return (
    <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 bg-white">
          <div className="flex items-center">
            <img
              src="/profileIcon.png"
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <div className="ml-3">
              <h2 className="font-semibold">{conversation?.name || "user"}</h2>
              <p className="text-sm text-gray-600">Recruiter at Nomad</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MessageCircle className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Star className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
  )
}

export default ChatHeader
