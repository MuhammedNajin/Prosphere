import React, { useContext, useEffect, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatArea from "./ChatArea";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import { ChatApi } from "@/api/Chat.api";
import { useGetUser } from "@/hooks/useGetUser";
import { convertToIST } from "@/lib/utilities/ConverttoIst";
import { SocketContext } from "@/context/socketContext";
import {
  AvatarUrls,
  ChatRole,
  Conversation,
  Message,
  MESSAGE_STATUS,
  ROLE,
  SelectedConversation,
} from "@/types/chat";
import { generateObjectId } from "@/lib/utilities/generateDocumentId";
import { ChevronLeft, Menu } from "lucide-react";
import { useSelectedCompany } from "@/hooks/useSelectedCompany";
import { ProfileApi } from "@/api/Profile.api";

const Chat: React.FC<ChatRole> = ({ context }) => {
  const [typing, setTyping] = useState(false);
  const { state } = useLocation();
  const { chatSocket } = useContext(SocketContext);
  const [selectedConversation, setConversation] =
    useState<SelectedConversation | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [urls, setUrls] = useState<AvatarUrls>({});
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  const user = useGetUser();
  const navigate = useNavigate();
  const client = useQueryClient();
  const company = useSelectedCompany();
  const [searchParams] = useSearchParams();
  const queryKey = context === ROLE.COMPANY ? "companyConv" : "userConv";
  const updateConversation = (msg: Message) => {
    client.setQueryData<Conversation[]>([queryKey], (oldData) => {
      if (!oldData) return [];

      return oldData?.map((conv) => {
        if (conv.id === msg.conversation) {
          conv.lastMessage = msg;
          conv.unreadCount = (conv.unreadCount || 0) + 1;
        }
        return conv;
      });
    });
  };

  const { data } = useQuery({
    queryKey: [queryKey],
    queryFn: () => ChatApi.getConversation(user._id, context, company?._id),
  });

  const addNewConversation = (newConv: Conversation) => {
    client.setQueryData<Conversation[]>([queryKey], (oldData) => {
      if (!oldData) return [newConv];
      return [...oldData, newConv];
    });
  };

  useEffect(() => {
    if (Array.isArray(data)) {
      const array = data
        .map((conv: Conversation) => conv.participants[0]?.avatar)
        .filter((avatar): avatar is string => typeof avatar === "string");
      console.log("array debug", array);
      async function getUrls(urls: string[]) {
        try {
          const data = await ProfileApi.getFiles(urls);
          console.log("data urls", data);

          const mappedUrls = data.reduce(
            (acc: Record<string, string>, url: string, index: number) => {
              const key = array[index];
              if (typeof key === "string") {
                acc[key] = url;
              }
              return acc;
            },
            {} as Record<string, string>
          );

          setUrls(mappedUrls);
        } catch (error) {
          console.error("Error fetching URLs:", error);
        }
      }

      getUrls(array);
    }
  }, [data]);

  useEffect(() => {
    console.log("urls debug", urls);
  }, [urls]);

  useEffect(() => {
    console.log("context", context);

    const applicant = state?.applicant;
    console.log("applicant", applicant);
    if (applicant && data) {
      const exist = data?.find(
        (conv: Conversation) => conv.participants[0]?._id === applicant?._id
      );
      console.log("exist", exist);

      if (!exist) {
        const newConversation: Conversation = {
          type: "direct",
          id: generateObjectId(),
          participants: [applicant],
          unreadCount: 0,
          updatedAt: new Date().toISOString(),
          context,
          company: {
            id: company?._id || "",
            name: company?.name || "",
            owner: company?.owner || "",
          },
        };

        addNewConversation(newConversation);

        setConversation({
          id: newConversation.id,
          name: newConversation?.participants[0]?.username,
          avatar: newConversation?.participants[0]?.avatar,
          receiverId: newConversation?.participants[0]?._id,
          context: newConversation.context,
          company: newConversation.company,
          newConv: true,
          lastSeen: new Date(),
          participant: newConversation.participants[0],
        });
      }
    }
  }, [state, data]);

  useEffect(() => {
    if (!chatSocket) return;

    chatSocket.emit("user_online", user._id);

    chatSocket.on("online_users", (users: string[]) => {
      setOnlineUsers(new Set(users));
    });

    const handleDirectMessage = (msg: Message) => {
      console.log(" direct message from browser ", msg);
      if (msg) {
        updateConversation(msg);
      }

      if (msg?.newConv) {
        const { id, content, sender, conversation, status, replyTo } = msg;
        addNewConversation({
          type: "direct",
          id: msg?.conversation,
          participants: [msg.receiverDetails],
          lastMessage: {
            id,
            content,
            sender,
            conversation,
            status,
            replyTo,
            context,
            receiverDetails: msg.receiverDetails,
            company: msg.company,
            companyId: msg.companyId,
          },
          unreadCount: 0,
          updatedAt: new Date().toISOString(),
          company: msg.company,
          context: msg.context,
        });
      }

      chatSocket.emit("deliver_message", {
        messageId: msg.id,
        receiver: msg.context === ROLE.COMPANY ? msg.companyId : msg.sender,
      });
    };

    chatSocket.on("direct_message", handleDirectMessage);

    return () => {
      chatSocket.off("direct_message");
      chatSocket.emit("user_offline", user._id);
      chatSocket.off("online_users");
    };
  }, [chatSocket]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    console.log("data", data);

    const id = searchParams.get("id");
    console.log(
      "searchParams",
      searchParams.get("id"),
      searchParams.get("ids")
    );
    if (searchParams.get("id")) {
      const conv = data?.find((conv: Conversation) => {
        console.log("conv.id", conv.id, id);
        if (conv.id == id) {
          return conv;
        }
      });
      console.log("selected conversation", conv);
      setConversation({
        id: conv?.id,
        name: conv?.participants[0]?.username,
        avatar: conv?.participants[0]?.avatar,
        receiverId: conv?.participants[0]?._id,
        context: conv?.context,
        company: conv?.company,
        lastSeen: conv?.participants[0]?.lastSeen,
        participant: conv?.participants[0],
      });
    }
  }, [data]);

  return (
    <div className="flex h-[95vh] bg-gray-100">
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed lg:relative w-full sm:w-80 bg-white border-r border-gray-200 z-40 lg:translate-x-0 transition-transform duration-300 ease-in-out h-full`}
      >
        <div className="p-2 md:p-4">
          <div className="flex py-2 pb-3 justify-between font-semibold items-center">
            <div className="flex gap-2 items-center">
              <button
                onClick={() => navigate("/")}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft size={20} />
              </button>
              <h1 className="text-base md:text-lg">Chats</h1>
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search messages"
              className="w-full px-3 py-1.5 md:px-4 md:py-2 bg-gray-100 rounded-lg focus:outline-none text-sm"
            />
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100%-5rem)]">
          {data?.map((conv: Conversation) => (
            <div
              onClick={() => {
                if (selectedConversation?.id === conv.id) return;

                setConversation({
                  id: conv.id,
                  name: conv?.participants[0]?.username,
                  avatar: urls[conv?.participants[0]?.avatar],
                  receiverId: conv?.participants[0]?._id,
                  context: conv.context,
                  company: conv.company,
                  lastSeen: conv?.participants[0]?.lastSeen,
                  participant: conv?.participants[0],
                });

                if (window.innerWidth < 1024) {
                  setSidebarOpen(false);
                }
              }}
              key={conv.id}
              className={`flex items-center px-3 py-2 md:px-4 md:py-3 transition-all duration-200 
            ${
              selectedConversation?.id === conv.id
                ? "bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-500"
                : "hover:bg-orange-50"
            } cursor-pointer relative group`}
            >
              <div className="relative">
                <img
                  src={
                    urls[conv?.participants[0]?.avatar] || "/profileIcon.png"
                  }
                  alt="Profile"
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 
                ${
                  selectedConversation?.id === conv.id
                    ? "border-orange-500 shadow-lg"
                    : "border-gray-200 group-hover:border-orange-300"
                } transition-all duration-200`}
                />
                {onlineUsers.has(conv?.participants[0]?._id) && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 md:w-3.5 md:h-3.5 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>

              <div className="ml-2 md:ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span
                    className={`font-semibold text-xs md:text-sm truncate
                ${
                  selectedConversation?.id === conv.id
                    ? "text-orange-900"
                    : "text-gray-700 group-hover:text-gray-900"
                }`}
                  >
                    {conv?.context === ROLE.COMPANY &&
                    conv.company.owner !== user._id
                      ? conv.company?.name
                      : conv.participants[0]?.username}
                  </span>
                  <span className="text-[10px] md:text-xs text-gray-500">
                    {convertToIST(conv.updatedAt)}
                  </span>
                </div>

                <div className="flex items-center justify-between w-full">
                  <p
                    className={`text-xs md:text-sm truncate max-w-[180px] 
                ${
                  conv.lastMessage?.status !== MESSAGE_STATUS.READ &&
                  user._id !== conv.lastMessage?.sender
                    ? "font-semibold text-black"
                    : "font-normal text-gray-600"
                }`}
                  >
                    {conv?.lastMessage?.content?.text}
                  </p>

                  {conv?.lastMessage?.status !== MESSAGE_STATUS.READ &&
                    user._id !== conv?.lastMessage?.sender &&
                    conv?.unreadCount > 0 && (
                      <div
                        className="flex items-center justify-center bg-orange-600 text-white rounded-full 
                    min-w-[18px] h-4 md:min-w-[20px] md:h-5 px-1.5 text-[8px] md:text-[9px] 
                    font-medium mr-2 shadow-sm transition-transform duration-200 
                    hover:scale-110"
                      >
                        {conv?.unreadCount}
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <ChatHeader
              conversation={selectedConversation}
              typing={typing}
              online={onlineUsers.has(selectedConversation.receiverId)}
            />
            <ChatArea
              context={context}
              conversation={selectedConversation}
              typing={typing}
              setTyping={setTyping}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p className="text-sm md:text-base">
              Select a conversation to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
