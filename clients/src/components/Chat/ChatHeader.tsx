import React from "react";
import { MessageCircle, MoreVertical } from "lucide-react";
import { ROLE } from "@/types/chat";
import { useGetUser } from "@/hooks/useGetUser";

interface ChatHeaderProps {
  conversation: unknown;
  typing: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ conversation, typing }) => {
  const user = useGetUser()
  return (
    <div className="h-14 md:h-16 flex items-center justify-between px-2 md:px-4 border-b border-gray-200 bg-white">
      <div className="flex items-center">
        <img
          src="/profileIcon.png"
          alt="Profile"
          className="w-8 h-8 md:w-10 md:h-10 rounded-full"
        />
        <div className="ml-2 md:ml-3">
          <h2 className="font-semibold text-sm md:text-base">
            { conversation.context === ROLE.COMPANY && conversation.company.owner !== user._id ? `${conversation.company?.name} (${conversation.name})` : conversation.name }
          </h2>
          <p className="text-xs md:text-sm text-orange-600 hidden sm:block animate-blink">
            {typing ? "typing..." : ""}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2 md:space-x-4">
        <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full">
          <MoreVertical className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
