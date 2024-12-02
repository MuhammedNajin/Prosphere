import { useGetUser } from "@/hooks/useGetUser";
import React, { createContext, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";

export const SocketContext = createContext<Socket | null>(null);

const SocketWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const user = useGetUser();

  useEffect(() => {
    let socketInstance: Socket | null = null;

    if (user) {
      socketInstance = io('http://localhost:6002', {
        transports: ["websocket", "polling"],
        reconnectionAttempts: 5,
      });

      socketInstance.on('connect', () => {
        console.log('Connected to Socket.IO server', user);
        socketInstance?.emit('join_room', {
          receiver: user?._id,
        });
        setSocket(socketInstance); 
      });

      socketInstance.on('connect_error', (error) => {
        console.error('Connection error::', error);
      });
    }

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
        setSocket(null);
      }
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketWrapper;