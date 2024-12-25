import { useGetUser } from "@/hooks/useGetUser";
import React, { createContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";

export const SocketContext = createContext<{ chatSocket: Socket | null; notificationSocket: Socket | null }>({
  chatSocket: null,
  notificationSocket: null,
});

const SocketWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chatSocket, setChatSocket] = useState<Socket | null>(null);
  const [notificationSocket, setNotificationSocket] = useState<Socket | null>(null);
  
  const user = useGetUser();

  useEffect(() => {
    let chatSocketInstance: Socket | null = null;
    let notificationSocketInstance: Socket | null = null;

    if (user) {
      chatSocketInstance = io('http://localhost:6002', {
        transports: ["websocket", "polling"],
        reconnectionAttempts: 5,
        path: '/socket.io/chat',

      });

      chatSocketInstance.on('connect', () => {
        console.log('Connected to Chat Socket.IO server', user);
        chatSocketInstance?.emit('join_room', { receiver: user?._id });
        setChatSocket(chatSocketInstance); 
      });

      chatSocketInstance.on('connect_error', (error) => {
        console.error('Chat Connection error:', error);
      });

      notificationSocketInstance = io('http://localhost:4000', {
        transports: ["websocket", "polling"],
        reconnectionAttempts: 5,
      });

      notificationSocketInstance.on('connect', () => {
        console.log('Connected to Notification Socket.IO server', user);
        notificationSocketInstance?.emit('subscribe', user?._id);
        setNotificationSocket(notificationSocketInstance); 
      });

      notificationSocketInstance.on('connect_error', (error) => {
        console.error('Notification Connection error:', error);
      });
    }

    return () => {
      if (chatSocketInstance) {
        chatSocketInstance.disconnect();
        setChatSocket(null);
      }
      
      if (notificationSocketInstance) {
        notificationSocketInstance.disconnect();
        setNotificationSocket(null);
      }
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ chatSocket, notificationSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketWrapper;