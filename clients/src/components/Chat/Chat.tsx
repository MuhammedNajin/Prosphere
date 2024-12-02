import React, { useContext, useEffect, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatArea from "./ChatArea";
import { useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import { ChatApi } from "@/api/Chat.api";
import { useGetUser } from "@/hooks/useGetUser";
import { convertToIST } from "@/lib/utilities/ConverttoIst";
import { SocketContext } from "@/context/socketContext";

const Chat: React.FC = () => {
  const { state } = useLocation();
  const socket = useContext(SocketContext);
  const [selectedCoversation, setConversation] = useState(null);
  const user = useGetUser();

  useEffect(() => {
    if (state?.applicant) {
      console.log("Applicant state:", state.applicant);
    }
  }, [state]);


  useEffect(() => {
    if (!socket) return;
    console.log("mounted ", selectedCoversation)
    const handleDirectMessage = (data) => {
      console.log("sidebar socket message", data);
      socket.emit("deliver_message", { 
        messageId: data.id, 
        receiver: data.sender 
      });
    };

    socket.on("direct_message", handleDirectMessage);

    return () => {
      console.log("clean up ", selectedCoversation)
      socket.off("direct_message", handleDirectMessage);
    };

  }, [socket]);



  const { data } = useQuery({
    queryKey: ['conversation'],
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
          {data?.data &&
            data?.data?.map((conv) => (
              <div
                onClick={() => {
                  setConversation({
                    id: conv?.participants[0]?._id,
                    name: conv?.participants[0]?.username,
                    avatar: conv?.participants[0]?.avatar,
                    conversationId: conv._id
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
                    <span className="font-semibold text-sm">
                      {conv?.participants[0]?.username}
                    </span>
                    <span className="text-xs text-gray-500">
                      {convertToIST(conv.updatedAt)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 truncate">
                    {conv?.lastMessage?.content?.text}
                  </p>
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
