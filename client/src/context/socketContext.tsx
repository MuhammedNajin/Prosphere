import { useCurrentUser } from "@/hooks/useSelectors";
// import { logoutThuck } from "@/redux/action/actions";
// import store from "@/redux/store";
import React, { createContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";

export interface SocketContextValue {
  chatSocket: Socket | null;
  notificationSocket: Socket | null;
  authSocket: Socket | null;
}

export const SocketContext = createContext<SocketContextValue>({
  chatSocket: null,
  notificationSocket: null,
  authSocket: null,
});

const SOCKET_CONFIG = {
  base: {
    transports: ["websocket", "polling"],
    reconnectionAttempts: 5,
  },
  urls: {
    // auth: import.meta.env.VITE_API_AUTH,
    chat: import.meta.env.VITE_API_CHAT,
    notification: import.meta.env.VITE_API_NOTIFICATION,
  }
};



const SocketWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chatSocket, setChatSocket] = useState<Socket | null>(null);
  const [notificationSocket, setNotificationSocket] = useState<Socket | null>(null);
  const [authSocket, setAuthSocket] = useState<Socket | null>(null);
  
  const user = useCurrentUser();

  useEffect(() => {
 
    let instances = {
      chat: null as Socket | null,
      notification: null as Socket | null,
      auth: null as Socket | null
    };

    
    if (user) {
     
      // instances.auth = io(SOCKET_CONFIG.urls.auth, {
      //   ...SOCKET_CONFIG.base,
      //   path: '/auth-socket/socket.io',
      // });

      // instances.auth.on('connect', () => {
      //   console.log('Connected to auth Socket.IO server', user);
      //   instances.auth?.emit('join_room', user?.id);
      // });

      // instances.auth.on('block:user', (roomId: string) => {
      //   console.log('User blocked - roomId:', roomId);
      //   store.dispatch(logoutThuck())
      //     .then(() => {
      //       window.location.href = '/signin';
      //     })
      //     .catch((error) => {
      //       console.error('Logout failed:', error);
      //     });
      // });

      // instances.auth.on('connect_error', (error) => {
      //   console.error('AUTH Connection error:', error);
      // });

      // setAuthSocket(instances.auth);

      instances.chat = io(SOCKET_CONFIG.urls.chat, {
        ...SOCKET_CONFIG.base,
        path: '/chat-socket/socket.io',
      });

      instances.chat.on('connect', () => {
        console.log('Connected to Chat Socket.IO server', user);
        instances.chat?.emit('join_room', { receiver: user?.id });
      });

      instances.chat.on('connect_error', (error) => {
        console.error('Chat Connection error:', error);
      });

      setChatSocket(instances.chat);
      instances.notification = io(SOCKET_CONFIG.urls.notification, {
        ...SOCKET_CONFIG.base,
        path: '/notification-socket/socket.io',
      });

      instances.notification.on('connect', () => {
        console.log('Connected to Notification Socket.IO server', user);
        instances.notification?.emit('subscribe', user?.id);
      });

      instances.notification.on('connect_error', (error) => {
        console.error('Notification Connection error:', error);
      });

      setNotificationSocket(instances.notification);

      Object.entries(instances).forEach(([name, socket]) => {
        if (socket) {
          socket.on('error', (error) => {
            console.error(`${name} socket error:`, error);
          });
        }
      });
    }

    return () => {
      console.log("unmount context");
      
      Object.entries(instances).forEach(([name, socket]) => {
        if (socket) {
          console.log(`Disconnecting ${name} socket`);
          socket.removeAllListeners();
         
          socket.disconnect();
        }
      });
      instances?.chat?.emit('last_seen', { id: user?.id });
      setChatSocket(null);
      setNotificationSocket(null);
      setAuthSocket(null);
    };
  }, [user]);

  const contextValue: SocketContextValue = {
    chatSocket,
    notificationSocket,
    authSocket
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = React.useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketWrapper');
  }
  return context;
};

export default SocketWrapper;