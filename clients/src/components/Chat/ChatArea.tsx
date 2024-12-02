import { useGetUser } from "@/hooks/useGetUser";
import { CircleCheckIcon, CircleDashed, Paperclip, Send, Smile } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { convertToIST } from "@/lib/utilities/ConverttoIst";
import { SocketContext } from "@/context/socketContext";
import { ChatApi } from "@/api/Chat.api";
import { useQuery, useQueryClient } from "react-query";
import { MESSAGE_STATUS } from "@/types/chat";
import { generateObjectId } from "@/lib/utilities/generateDocumentId";
import { TbCircleCheckFilled } from "react-icons/tb";

interface ChatAreaProps {
  conversation?: unknown;
}

interface MessageContent {
  text?: string;
  type: string;
}

interface Message {
  _id: string;
  content: MessageContent;
  conversation: string;
  sender: string;
  replyTo: string | null;
}

const ChatArea: React.FC<ChatAreaProps> = ({ conversation }) => {
  const user = useGetUser();

  const [content, setContent] = useState<string>("");
  const socket = useContext(SocketContext);

  const { data } = useQuery({
    queryKey: ["chat"],
    queryFn: () => ChatApi.getChat(conversation.conversationId),
  });

  const queryClient = useQueryClient();

  const addNewMessage = (newMessage: Message) => {
    queryClient.setQueryData<Message[]>(["chat"], (oldData) => {
      if (!oldData) return [newMessage];
      return [...oldData, newMessage];
    });
  };

  const chageStatusToDeliver = (id: string) => {
    queryClient.setQueryData<Message[]>(["chat"], (oldData) => {
      if(!oldData) return [];
      return oldData.map((msg) => {
         if(msg.id === id) {
           msg.status = MESSAGE_STATUS.DELIVERED
         }
         return msg;
      })
    })
  } 

  useEffect(() => {
    console.log("socket", socket);

    // listen the message from server

    socket?.on("private_message", (data) => {
      console.log("private_message", data);
      addNewMessage(data);
    });
    

    // it will update the status to delivered
    socket?.on('deliver_message', (id: string) => {
      console.log("message delivered", id)
        chageStatusToDeliver(id)
    })

    socket?.emit("join_conversation", conversation.conversationId);

    // off the listener when unmonted other way's it will register two times in dev mode
    return () => {
      socket?.off("direct_message");
      socket?.off("private_message");
      socket?.emit("leave_conversation", conversation.conversationId);
    };
  }, [socket?.connected]);

  useEffect(() => {
    console.log("conversation", conversation);
    console.log("api responses", data);
  }, [conversation, data]);

  async function handleSend() {
    setContent("");
   const id =  generateObjectId();
    const newMessage = {
      id,
      conversation: conversation.conversationId,
      sender: user._id,
      receiver: conversation?.id,
      content: {
        type: "text",
        text: content,
      },
      status: MESSAGE_STATUS.SENT,
      createdAt: new Date().toISOString(),
      replayTo: null,
    };

    const msg = {
      id,
      sender: user._id,
      receiver: conversation?.id,
      content: {
        type: "text",
        text: content,
      },
    };
   console.log("msg",  msg);
   
    socket?.emit("direct_message", newMessage);

    addNewMessage(newMessage);
    await ChatApi.sendMessage(msg);
  }
  

  const getStatusIcon = (status: MESSAGE_STATUS) => {
    const baseClasses = "w-3 h-3 transition-all duration-200";
    
    switch (status) {
      case 'sent':
        return (
          <CircleDashed 
            className={`${baseClasses} text-gray-400`} 
          />
        );
      
      case 'delivered':
        return (
          <CircleCheckIcon 
            className={`${baseClasses} text-gray-500 hover:text-gray-600`}
          />
        );
      
      case 'read':
      
        return (
          <TbCircleCheckFilled
         
            className={`${baseClasses} w-4 h-5 text-accent-green hover:text-green-600`}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <>
       <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {data?.map((msg) =>
        msg?.sender !== user?._id ? (
          <div className="flex items-start space-x-3" key={msg?._id}>
            <img
              src="/profileIcon.png"
              alt="Jan"
              className="w-7 h-7 rounded-full"
            />
            <div className="flex flex-col">
              <div className="bg-white text-gray-600 rounded-lg p-3 max-w-md shadow">
                <p className="text-sm">{msg?.content?.text}</p>
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {convertToIST(msg?.createdAt)}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-end space-x-3" key={msg?._id}>
            <div className="flex flex-col items-end">
              <div className="bg-orange-700 text-white shadow rounded-lg p-3 max-w-md">
                <p className="text-sm">{msg?.content?.text}</p>
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <span className="text-xs text-gray-500">
                  {convertToIST(msg?.createdAt)}
                </span>
                {getStatusIcon(msg?.status)}
              </div>
            </div>
            <img
              src="/profileIcon.png"
              alt="Jan"
              className="w-7 h-7 rounded-full"
            />
          </div>
        )
      )}
    </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>
          <div className="relative w-full flex flex-1">
            <input
              value={content}
              onChange={(e) => {
                console.log(e.target.value);

                setContent(e.target.value);
              }}
              type="text"
              placeholder="Reply message"
              className="flex-1 px-4 py-2 bg-gray-100 rounded-lg focus:outline-none"
            />
            <button className="p-2 hover:bg-gray-100 rounded-full absolute right-0">
              <Smile className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <button
            onClick={handleSend}
            className="p-3 inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 rounded-full"
          >
            <Send size={18} className=" text-white" />
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatArea;
