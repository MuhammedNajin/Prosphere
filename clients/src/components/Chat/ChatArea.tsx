import React, { useContext, useEffect, useState } from "react";
import {
  CircleCheckIcon,
  CircleDashed,
  Paperclip,
  Send,
  Smile,
  ChevronDown,
  Reply,
  Trash,
  Trash2,
} from "lucide-react";
import { TbCircleCheckFilled } from "react-icons/tb";
import { useGetUser } from "@/hooks/useGetUser";
import { SocketContext } from "@/context/socketContext";
import { ChatApi } from "@/api/Chat.api";
import { useQuery, useQueryClient } from "react-query";
import { MESSAGE_STATUS } from "@/types/chat";
import { generateObjectId } from "@/lib/utilities/generateDocumentId";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TypingIndicator from "./TypingIndicator";

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
  status?: string;
  createdAt: string;
}

const ChatArea: React.FC<ChatAreaProps> = ({ conversation }) => {
  const user = useGetUser();
  const [content, setContent] = useState("");
  const { chatSocket } = useContext(SocketContext);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["chat", conversation],
    queryFn: () => ChatApi.getChat(conversation.conversationId),
  });

  const isToday = (date) => {
    const today = new Date();
    const messageDate = new Date(date);
    return (
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear()
    );
  };

  const isYesterday = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const messageDate = new Date(date);
    return (
      messageDate.getDate() === yesterday.getDate() &&
      messageDate.getMonth() === yesterday.getMonth() &&
      messageDate.getFullYear() === yesterday.getFullYear()
    );
  };

  const getMessageDateHeader = (date) => {
    if (!date) return "";
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";

    const messageDate = new Date(date);
    const today = new Date();
    const diffTime = Math.abs(today - messageDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) {
      return messageDate.toLocaleDateString("en-US", { weekday: "long" });
    }
    return messageDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderDateHeader = (currentMsg, prevMsg) => {
    if (!prevMsg)
      return (
        <div className="flex justify-center my-4">
          <div className="bg-gray-300 px-3 py-1 rounded-lg text-sm text-gray-800">
            {getMessageDateHeader(currentMsg?.createdAt)}
          </div>
        </div>
      );

    const currentDate = getMessageDateHeader(currentMsg?.createdAt);
    const prevDate = getMessageDateHeader(prevMsg?.createdAt);

    if (currentDate !== prevDate) {
      return (
        <div className="flex justify-center my-4">
          <div className="bg-gray-300 px-3 py-1 rounded-lg text-sm text-gray-700">
            {currentDate}
          </div>
        </div>
      );
    }
    return null;
  };

  const getStatusIcon = (status) => {
    const baseClasses = "w-3 h-3 transition-all duration-200";
    switch (status) {
      case "sent":
        return <CircleDashed className={`${baseClasses} text-gray-400`} />;
      case "delivered":
        return (
          <CircleCheckIcon
            className={`${baseClasses} text-gray-500 hover:text-gray-600`}
          />
        );
      case "read":
        return (
          <TbCircleCheckFilled
            className={`${baseClasses} w-4 h-5 text-accent-green hover:text-green-600`}
          />
        );
      default:
        return null;
    }
  };

  const handleMessageAction = {
    reply: (msg: Message) => {
      console.log('Reply to:', msg);
      // Implement reply logic
    },
    delete: (msg: Message) => {
      console.log('Delete message:', msg);
      // Implement delete logic
    },
    deleteForEveryone: (msg: Message) => {
      console.log('Delete for everyone:', msg);
      // Implement delete for everyone logic
    }
  };

  const addNewMessage = (newMessage: Message) => {
    queryClient.setQueryData<Message[]>(["chat", conversation], (oldData) => {
      if (!oldData) return [newMessage];
      return [...oldData, newMessage];
    });
  };

  const changeMessageStatus = (id: string, status: string) => {
    queryClient.setQueryData<Message[]>(["chat", conversation], (oldData) => {
      if (!oldData) return [];
      return oldData.map((msg) => {
        if (msg._id === id) {
          return { ...msg, status };
        }
        return msg;
      });
    });
  };

  const readMessage = () => {
    queryClient.setQueryData<Message[]>(["chat", conversation], (oldData) => {
      if (!oldData) return [];
      return oldData.map((msg) => ({ ...msg, status: MESSAGE_STATUS.READ }));
    });
  };

  useEffect(() => {
    if (!chatSocket?.connected) return;

    chatSocket.on("private_message", (data) => {
      addNewMessage(data);
      handleReadMessage();
    });

    function handleReadMessage() {
      chatSocket.emit("read_message", {
        conversationId: conversation.conversationId,
        sender: conversation?.id,
      });
    }

    handleReadMessage();

    chatSocket.on("deliver_message", (conversationId: string) => {
      changeMessageStatus(conversationId, MESSAGE_STATUS.DELIVERED);
    });

    chatSocket.on("read_message", (conversationId: string) => {
      readMessage();
    });

    chatSocket.emit("join_conversation", {
      conversationId: conversation.conversationId,
    });

    return () => {
      chatSocket.off("direct_message");
      chatSocket.off("private_message");
      chatSocket.emit("leave_conversation", {
        conversationId: conversation.conversationId
      });
    };
  }, [chatSocket?.connected]);

  const handleSend = async () => {
    if (!content) return;

    const id = generateObjectId();
    const newConv = conversation?.newConv ?? false;
    const newMessage = {
      _id: id,
      conversation: conversation.conversationId,
      sender: user._id,
      receiver: conversation?.id,
      content: {
        type: "text",
        text: content,
      },
      status: MESSAGE_STATUS.SENT,
      createdAt: new Date().toISOString(),
      replyTo: null,
      newConv: newConv,
      receiverDetails: newConv ? newConv : undefined,
    };

    chatSocket?.emit("direct_message", newMessage);
    addNewMessage(newMessage);
    await ChatApi.sendMessage({
      id,
      sender: user._id,
      receiver: conversation?.id,
      content: { type: "text", text: content },
      conversationId: conversation.conversationId,
    });

    setContent("");
  };

  const MessageComponent = ({ msg }: { msg: Message }) => {
    const [showActions, setShowActions] = useState(false);
    const isOwnMessage = msg?.sender === user?._id;

    const messageStyles = isOwnMessage
      ? "bg-orange-700 text-white before:border-l-orange-700 before:border-t-orange-700"
      : "bg-white text-gray-600 before:border-r-white before:border-t-white";

    const timeStyles = isOwnMessage ? "text-gray-200" : "text-gray-500";

    return (
      <div className={`flex items-start ${isOwnMessage ? 'justify-end' : ''} space-x-3`}>
        <div className="flex gap-x-1 max-w-md items-end relative group">
          <div
            className={`flex gap-x-2 shadow rounded-md p-2 pb-1 relative
              before:content-[''] before:absolute before:top-0 
              before:w-0 before:h-0 before:border-[8px] 
              before:border-solid before:border-b-transparent 
              ${isOwnMessage 
                ? 'before:right-[-8px] before:border-r-transparent' 
                : 'before:left-[-8px] before:border-l-transparent'
              }
              ${messageStyles}`}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
          >
            <div className="h-6">
              <p className="text-sm self-start">{msg?.content?.text}</p>
            </div>
            
            <div className="flex justify-end items-center mt-1 space-x-1 min-w-[65px]">
              <span className={`text-[11px] self-end ${timeStyles}`}>
                {new Date(msg?.createdAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {showActions && (
              <div className="absolute top-0 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded-full hover:bg-black/10 transition-colors">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => handleMessageAction.reply(msg)} className="gap-2">
                      <Reply className="w-4 h-4" />
                      <span>Reply</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleMessageAction.delete(msg)} className="gap-2 text-red-600">
                      <Trash className="w-4 h-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                    {isOwnMessage && (
                      <DropdownMenuItem 
                        onClick={() => handleMessageAction.deleteForEveryone(msg)} 
                        className="gap-2 text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete for everyone</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
          {isOwnMessage && getStatusIcon(msg?.status)}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-scrollbar">
        {data?.map((msg, index) => (
          <React.Fragment key={msg?._id}>
            {renderDateHeader(msg, data[index - 1])}
            <MessageComponent msg={msg} />
          </React.Fragment>
        ))}
        <TypingIndicator />
      </div>

      <div className="p-4 pb-0 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>
          <div className="relative w-full flex flex-1">
            <input
              value={content}
              onChange={(e) => setContent(e.target.value)}
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
            className="p-3 inline-flex items-center justify-center bg-orange-600 hover:bg-orange-700 rounded-full"
          >
            <Send size={18} className="text-white" />
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatArea;