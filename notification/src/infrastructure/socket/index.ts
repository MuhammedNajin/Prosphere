import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { EventEmitter } from 'events';

export interface NotificationMessage {
  type: string;
  content: any;
  userId?: string; 
  timestamp?: Date; 
}

export class NotificationSocketManager extends EventEmitter {
  private static instance: NotificationSocketManager;
  private io: SocketIOServer;
  private activeRooms: Map<string, Set<string>> = new Map();

  private constructor(server: HTTPServer) {
    super();
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST']
      },
      path: '/notification-socket/socket.io',
      pingTimeout: 60000,
      pingInterval: 25000
    });

    this.initializeHandlers();
  }

  

  public static getInstance(server?: HTTPServer): NotificationSocketManager {
    if (!NotificationSocketManager.instance && server) {
      NotificationSocketManager.instance = new NotificationSocketManager(server);
    }
    return NotificationSocketManager.instance;
  }

  public static getSocket(): SocketIOServer | null {
    if (!NotificationSocketManager.instance) {
      console.warn('NotificationSocketManager has not been initialized');
      return null;
    }

    return NotificationSocketManager.instance.io;
  }

  private initializeHandlers(): void {
    
    this.io.on('connection', (socket: Socket) => {
      console.log("New connection request");
      this.handleConnection(socket);
      this.handleNotificationEvents(socket);
      this.handleDisconnection(socket);
    });

    this.io.engine.on('connection_error', (error: Error) => {
      console.error('Socket.IO connection error:', error);
      this.emit('error', error);
    });
  }



  private handleConnection(socket: Socket): void {
    console.log(`New client connected: ${socket.id}`);
    this.emit('clientConnected', socket.id);
  }

  private handleNotificationEvents(socket: Socket): void {
    socket.on('subscribe', (roomId: string) => {
      console.log("subscribe", roomId);
      
      this.subscribeToRoom(socket, roomId);
    });

    socket.on('unsubscribe', (roomId: string) => {
      this.unsubscribeFromRoom(socket, roomId);
    });

    socket.on('send_notification', (data: NotificationMessage) => {
      this.sendNotification(data);
    });
  }

  private handleDisconnection(socket: Socket): void {
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      this.emit('clientDisconnected', socket.id);
    });
    
    socket.on('error', (error: Error) => {
      console.error(`Socket error from ${socket.id}:`, error);
      this.emit('clientError', { socketId: socket.id, error });
    });
  }

  private subscribeToRoom(socket: Socket, roomId: string): void {
    socket.join(roomId);
    
    if (!this.activeRooms.has(roomId)) {
      this.activeRooms.set(roomId, new Set());
    }
    
    this.activeRooms.get(roomId)?.add(socket.id);
    
    console.log(`Client ${socket.id} subscribed to room: ${roomId}`);
  }

  private unsubscribeFromRoom(socket: Socket, roomId: string): void {
    socket.leave(roomId);

    const clientsInRoom = this.activeRooms.get(roomId);
    
    if (clientsInRoom) {
      clientsInRoom.delete(socket.id);

      if (clientsInRoom.size === 0) {
        this.activeRooms.delete(roomId);
      }
      
      console.log(`Client ${socket.id} unsubscribed from room: ${roomId}`);
      
      socket.to(roomId).emit('user_unsubscribed', { userId: socket.id });
      
      this.emit('roomLeft', { socketId: socket.id, roomId });
    }
  }

  private sendNotification(data: NotificationMessage): void {
    const { type, content, userId } = data;
    
    if (userId) {
      this.io.to(userId).emit(type, { content, timestamp: new Date() });
      console.log(`Sent notification to user ${userId}:`, content);
    } else {
   
      const rooms = Array.from(this.activeRooms.keys());
      
      rooms.forEach(room => {
        this.io.to(room).emit(type, { content, timestamp: new Date() });
        console.log(`Broadcasted notification to room ${room}:`, content);
      });
    }
    
    this.emit('notificationSent', data);
  }

  

  public getActiveRooms(): string[] {
    return Array.from(this.activeRooms.keys());
  }

  public shutdown(): void {
    this.io.close();
    console.log('Socket.IO server closed');
  }


}