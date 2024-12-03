import React, { useContext, useEffect, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatArea from "./ChatArea";
import { useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import { ChatApi } from "@/api/Chat.api";
import { useGetUser } from "@/hooks/useGetUser";
import { convertToIST } from "@/lib/utilities/ConverttoIst";
import { SocketContext } from "@/context/socketContext";
import { MESSAGE_STATUS } from "@/types/chat";

interface conversation {
  id: string;
  type: "direct" | "group";
  participants: string[];
  lastMessage: Message;
  admins: string[];
  muted: Array<{
    user: string;
    mutedUntil: Date | null;
  }>;
  unreadCount: number;
  pinnedBy: string[];
}

interface Message {
  id: string;
  conversation: string;
  sender: string;
  content: {
    type: "text" | "image" | "file" | "audio";
    text?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
  };
  status: MESSAGE_STATUS;
  replyTo?: string;
}

const Chat: React.FC = () => {
  const { state } = useLocation();
  const { chatSocket } = useContext(SocketContext);
  const [selectedCoversation, setConversation] = useState(null);
  const user = useGetUser();

  const client = useQueryClient();
  const updateConversation = (msg: Message) => {
    client.setQueryData<conversation[]>(["conversation"], (oldData) => {
      console.log("old data", oldData);

      if (!oldData) return [];

      return oldData?.map((cov) => {
        if (cov.id === msg.conversation) {
          cov.lastMessage = msg;
          cov.unreadCount += 1
        }
        return cov;
      });
    });
  };

  useEffect(() => {
    if (state?.applicant) {
      console.log("Applicant state:", state.applicant);
    }
  }, [state]);

  useEffect(() => {
    if (!chatSocket) return;
    console.log("mounted ", selectedCoversation);
    const handleDirectMessage = (data) => {
      console.log("sidebar chatSocket message", data);
      if (data) {
        updateConversation(data);
      }
      chatSocket.emit("deliver_message", {
        messageId: data.id,
        receiver: data.sender,
      });
    };

    chatSocket.on("direct_message", handleDirectMessage);

    return () => {
      console.log("clean up ", selectedCoversation);
      chatSocket.off("direct_message", handleDirectMessage);
    };
  }, [chatSocket]);

  const { data } = useQuery({
    queryKey: ["conversation"],
    queryFn: () => ChatApi.getConversation(user._id),
  });

  useEffect(() => {
    console.log("con", selectedCoversation);
    console.log("data", data);
  }, [data]);

  return (
    <div className="flex h-[85vh] bg-gray-100">
      <div className="w-80 bg-white border-r border-gray-200">
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search messages"
              className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-y-auto">
          {data &&
            data?.map((conv: conversation) => (
              <div
                onClick={() => {
                  if(selectedCoversation?.id === conv.id) {
                     return
                  }

                  

                  setConversation({
                    id: conv?.participants[0]?._id,
                    name: conv?.participants[0]?.username,
                    avatar: conv?.participants[0]?.avatar,
                    conversationId: conv.id,
                  });
                }}
                key={conv.id}
                className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer"
              >
                <img
                  src="/profileIcon.png"
                  alt={conv.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm text-gray-600">
                      {conv?.participants[0]?.username}
                    </span>
                    <span className="text-xs text-gray-500">
                      {convertToIST(conv.updatedAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between w-full hover:bg-gray-50 transition-colors duration-200 rounded-lg">
                    <div className="flex-grow mr-2 min-w-0">
                      <p
                        className={`
                            text-sm 
                            truncate 
                            max-w-full 
                            ${
                              conv.lastMessage.status !== MESSAGE_STATUS.READ &&
                              user._id !== conv.lastMessage.sender
                                ? "font-semibold text-black"
                                : "font-normal text-gray-600"
                            }
                          `}
                      >
                        {conv?.lastMessage?.content?.text || "No messages yet"}
                      </p>
                    </div>

                    {conv.lastMessage.status !== MESSAGE_STATUS.READ &&
                      user._id !== conv.lastMessage.sender && (
                        <div
                          className="
                                flex 
                                items-center 
                                justify-center 
                                bg-orange-600 
                                text-white 
                                rounded-full 
                                min-w-[20px] 
                                h-5
                                px-1 
                                text-[9px] 
                                font-medium
                                mr-2
                              "
                          aria-label="Unread messages count"
                        >
                          { conv.unreadCount }
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedCoversation && (
          <>
            <ChatHeader conversation={selectedCoversation} />

            <ChatArea conversation={selectedCoversation} />
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
