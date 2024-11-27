import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { EventEmitter } from 'events';

export interface SocketMessage {
  room: string;
  content: any;
  userId?: string;
  timestamp?: Date;
}

export class SocketManager extends EventEmitter {
  private static instance: SocketManager;
  private io: SocketIOServer;
  private activeRooms: Map<string, Set<string>> = new Map();

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
      console.log(socket);
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
    socket.on('join_room', (roomId: string) => {
      this.joinRoom(socket, roomId);
    });

    socket.on('leave_room', (roomId: string) => {
      this.leaveRoom(socket, roomId);
    });
  }

  private handleMessageEvents(socket: Socket): void {
    socket.on('message', (data: SocketMessage) => {
      this.broadcastToRoom(socket, data);
    });

    socket.on('direct_message', (data: { recipientId: string; content: any }) => {
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
    
    if (!this.activeRooms.has(roomId)) {
      this.activeRooms.set(roomId, new Set());
    }
    this.activeRooms.get(roomId)?.add(socket.id);

    console.log(`Client ${socket.id} joined room: ${roomId}`);
    
    socket.to(roomId).emit('user_joined', {
      userId: socket.id,
      timestamp: new Date()
    });

    this.emit('roomJoined', { socketId: socket.id, roomId });
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

  private sendDirectMessage(socket: Socket, data: { recipientId: string; content: any }): void {
    this.io.to(data.recipientId).emit('direct_message', {
      senderId: socket.id,
      content: data.content,
      timestamp: new Date()
    });

    this.emit('directMessageSent', {
      from: socket.id,
      to: data.recipientId,
      content: data.content
    });
  }

  private handleClientDisconnection(socket: Socket): void {
    console.log(`Client disconnected: ${socket.id}`);
    
    // Remove client from all active rooms
    this.activeRooms.forEach((clients, roomId) => {
      if (clients.has(socket.id)) {
        clients.delete(socket.id);
        if (clients.size === 0) {
          this.activeRooms.delete(roomId);
        }
      }
    });

    this.emit('clientDisconnected', socket.id);
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