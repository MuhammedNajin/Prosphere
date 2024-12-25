import React, { useContext, useEffect, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatArea from "./ChatArea";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import { ChatApi } from "@/api/Chat.api";
import { useGetUser } from "@/hooks/useGetUser";
import { convertToIST } from "@/lib/utilities/ConverttoIst";
import { SocketContext } from "@/context/socketContext";
import { ChatRole, Conversation, Message, MESSAGE_STATUS, ROLE, selectedConversation } from "@/types/chat";
import { generateObjectId } from "@/lib/utilities/generateDocumentId";
import { ChevronLeft, Menu } from "lucide-react";
import { useSelectedCompany } from "@/hooks/useSelectedCompany";
import { CompanyApi } from "@/api";

const Chat: React.FC<ChatRole> = ({ context }) => {
  const [typing, setTyping] = useState(false)
  const { state } = useLocation();
  const { chatSocket } = useContext(SocketContext);
  const [selectedConversation, setConversation] = useState<selectedConversation | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const user = useGetUser();
  const navigate = useNavigate();
  const client = useQueryClient();
  const company = useSelectedCompany()
  const [searchParams] = useSearchParams()
  const queryKey = context === ROLE.COMPANY ? "companyConv" : "userConv"
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
    console.log("context", context);
    
    const applicant = state?.applicant;
    console.log("applicant", applicant)
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
        });
      }
    }
  }, [state, data]);

  useEffect(() => {
    if (!chatSocket) return;

    const handleDirectMessage = (msg: Message) => {
      console.log(" direct message from browser ", msg)
      if (msg) {
        updateConversation(msg);
      }

      if (msg?.newConv) {
        const { id, content, sender, conversation, status, replyTo } = msg;
        addNewConversation({
          type: "direct",
          id: msg?.conversation,
          participants: [msg?.receiverDetails],
          lastMessage: { id, content, sender, conversation, status, replyTo },
          unreadCount: 0,
          updatedAt: new Date().toISOString(),
        });
      }

      chatSocket.emit("deliver_message", {
        messageId: msg.id,
        receiver: msg.context === ROLE.COMPANY ? msg.companyId : msg.sender,
      });
    };

    chatSocket.on("direct_message", handleDirectMessage);

   
    return () => {
      chatSocket.off("direct_message", handleDirectMessage);
    };
  }, [chatSocket]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };


  const getUrl = async (key: string) => {
    // if(!key) return;

    const response = await CompanyApi.getUploadedFIle(key);
    console.log("response", response);
    return response.data?.url
  }

  useEffect(() => {
    console.log("data", data);
    
    const id = searchParams.get('id')
    console.log("searchParams", searchParams.get('id'), searchParams.get('ids'));
    if(searchParams.get('id')) {
      const conv = data?.find((conv: Conversation) => {
        console.log("conv.id", conv.id, id)
         if(conv.id == id) {
           return conv;
         }
      })
 console.log("selected conversation", conv)
      setConversation({
        id: conv?.id,
        name: conv?.participants[0]?.username,
        avatar: conv?.participants[0]?.avatar,
        receiverId: conv?.participants[0]?._id,
        context: conv?.context,
        company: conv?.company
      });

    }
      
      
  }, [data])


  return (
    <div className="flex h-[95vh] bg-gray-100">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar */}
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
                  avatar: conv?.participants[0]?.avatar,
                  receiverId: conv?.participants[0]?._id,
                  context: conv.context,
                  company: conv.company
                });
                if (window.innerWidth < 1024) {
                  setSidebarOpen(false);
                }
              }}
              key={conv.id}
              className="flex items-center px-3 py-2 md:px-4 md:py-3 hover:bg-gray-50 cursor-pointer"
            >
              <img
                src={() => {
                 getUrl(conv?.participants[0]?.avatar).then((url) => {
                  return url ? url : "/profileIcon.png" 
                 })
              
                }}
                alt="Profile"
                className="w-8 h-8 md:w-10 md:h-10 rounded-full"
              />
              <div className="ml-2 md:ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-xs md:text-sm text-gray-600 truncate">
                    {conv?.context === ROLE.COMPANY && conv.company.owner !== user._id ? conv.company?.name : conv.participants[0]?.username}
                  </span>
                  <span className="text-[10px] md:text-xs text-gray-500">
                    {convertToIST(conv.updatedAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between w-full">
                  <p
                    className={`text-xs md:text-sm truncate max-w-[180px] ${
                      conv.lastMessage?.status !== MESSAGE_STATUS.READ &&
                      user._id !== conv.lastMessage?.sender
                        ? "font-semibold text-black"
                        : "font-normal text-gray-600"
                    }`}
                  >
                    {conv?.lastMessage?.content?.text}
                  </p>
                  {conv?.lastMessage?.status !== MESSAGE_STATUS.READ &&
                    user._id !== conv?.lastMessage?.sender && (
                     conv?.unreadCount > 0 && (
                      <div className="flex items-center justify-center bg-orange-600 text-white rounded-full min-w-[18px] h-4 md:min-w-[20px] md:h-5 px-1 text-[8px] md:text-[9px] font-medium mr-2">
                      {conv?.unreadCount}
                    </div>
                     )
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
            <ChatHeader conversation={selectedConversation} typing={typing} />
            <ChatArea context={context} conversation={selectedConversation} typing={typing} setTyping={setTyping}/>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p className="text-sm md:text-base">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;