import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { EventEmitter } from 'events';
import chatRepository from '../repository/chat.repository';
import { MESSAGE_STATUS } from '@/shared/enums/messageEnums';
export interface SocketMessage {
  room: string;
  content: any;
  userId?: string;
  timestamp?: Date;
}

export class SocketManager extends EventEmitter {
  private static instance: SocketManager;
  private io: SocketIOServer;
  private activeRooms: Map<string, string> = new Map();

  private constructor(server: HTTPServer) {
    super();
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST']
      },
      pingTimeout: 60000,
      pingInterval: 25000
    });
   
   this.io.use((socket, next) => {
     
     next()
   })

    this.initializeHandlers();
  }

  public static getInstance(server?: HTTPServer): SocketManager {
    if (!SocketManager.instance && server) {
      SocketManager.instance = new SocketManager(server);
    }
    return SocketManager.instance;
  }

  private initializeHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
        console.log(" conneection request")
      this.handleConnection(socket);
      this.handleRoomEvents(socket);
      this.handleMessageEvents(socket);
      this.handleDisconnection(socket);
      this.changeStatusTODeliver(socket);
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

  private handleRoomEvents(socket: Socket): void {
    socket.on('join_room', (data: { receiver: string }) => {
      console.log("roomId", data)
      const { receiver } = data
      this.joinRoom(socket, receiver);
    });

    socket.on('leave_room', (roomId: string) => {
      this.leaveRoom(socket, roomId);
    });

    socket.on("join_conversation", (conversationId) => {
        console.log("join_conversation", conversationId);
        socket.join(conversationId)
    })

    socket.on('leave_conversation', (conversationId) => {
      console.log("leave_coversation", conversationId);
       socket.leave(conversationId)
    })
  }

  private handleMessageEvents(socket: Socket): void {
    socket.on('message', (data: SocketMessage) => {
      // this.broadcastToRoom(socket, data);
    });

    socket.on('direct_message', (data: { reciever: string; content: any }) => {
      console.log("direct_message", data)
      this.sendDirectMessage(socket, data);
    });
  }

  private handleDisconnection(socket: Socket): void {
    socket.on('disconnect', () => {
      this.handleClientDisconnection(socket);
    });

    socket.on('error', (error: Error) => {
      console.error(`Socket error from ${socket.id}:`, error);
      this.emit('clientError', { socketId: socket.id, error });
    });
  }

  private joinRoom(socket: Socket, roomId: string): void {
    socket.join(roomId);
    if(!this.activeRooms.has(roomId)) {
       this.activeRooms.set(roomId, socket.id);
    }
    console.log(`Client ${socket.id} joined room: ${roomId}`, this.activeRooms);
  }

  private leaveRoom(socket: Socket, roomId: string): void {
    socket.leave(roomId);
    this.activeRooms.get(roomId)?.delete(socket.id);
    
    if (this.activeRooms.get(roomId)?.size === 0) {
      this.activeRooms.delete(roomId);
    }

    console.log(`Client ${socket.id} left room: ${roomId}`);
    
    socket.to(roomId).emit('user_left', {
      userId: socket.id,
      timestamp: new Date()
    });

    this.emit('roomLeft', { socketId: socket.id, roomId });
  }

  private broadcastToRoom(socket: Socket, data: SocketMessage): void {
    console.log(`Message received in room ${data.room}:`, data.content);
    
    this.io.to(data.room).emit('message', {
      userId: socket.id,
      content: data.content,
      timestamp: new Date()
    });

    this.emit('messageSent', { socketId: socket.id, room: data.room, content: data.content });
  }

  private sendDirectMessage(socket: Socket, data: { receiver: string; content: any, time: string, conversation: string }): void {
    console.log(" re cived",   this.activeRooms.get(data.receiver), data.conversation);
    this.io.to(data.receiver).emit('direct_message', data);
    this.io.to(data.conversation).emit("private_message", data);
  }

  private handleClientDisconnection(socket: Socket): void {
    console.log(`Client disconnected: ${socket.id}`);
    
    this.emit('clientDisconnected', socket.id);
  }

  private changeStatusTODeliver(socket: Socket): void {
     socket.on('deliver_message', (data: { receiver: string, messageId: string }) => {
         console.log("deliver_message listen from server", data);
         this.io.to(data.receiver).emit('deliver_message', data.messageId);
        chatRepository.changeMessageStatus(data.messageId, MESSAGE_STATUS.DELIVERED)
     })
  }

  public getRoomMembers(roomId: string): string[] {
    return Array.from(this.activeRooms.get(roomId) || []);
  }

  public getActiveRooms(): string[] {
    return Array.from(this.activeRooms.keys());
  }

  public broadcastToAll(event: string, data: any): void {
    this.io.emit(event, data);
  }

  public shutdown(): void {
    this.io.close();
    console.log('Socket.IO server closed');
  }
}