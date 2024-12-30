import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import { EventEmitter } from "events";
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
        origin: process.env.CORS_ORIGIN || "*",
        methods: ["GET", "POST"],
      },
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    this.io.use((socket, next) => {
      next();
    });

    this.initializeHandlers();
  }

  public static getInstance(server?: HTTPServer): SocketManager {
    if (!SocketManager.instance && server) {
      SocketManager.instance = new SocketManager(server);
    }
    return SocketManager.instance;
  }

  private initializeHandlers(): void {
    this.io.on("connection", (socket: Socket) => {
      this.blockUser(socket);

      socket.on('join_room', roomId => {
        console.log("join_room", roomId);
        
        this.joinRoom(socket, roomId);
      })

    });

    this.io.engine.on("connection_error", (error: Error) => {
      console.error("Socket.IO connection error:", error);
      this.emit("error", error);
    });
  }

  private blockUser(socket: Socket) {
    socket.on("block:user", ({ roomId }: { roomId: string }) => {
        console.log("block: user", roomId);
        
      this.io.to(roomId).emit("block:user", roomId);
    });
  }

  private joinRoom(socket: Socket, roomId: string) {
    console.log("join room new ", roomId)
     socket.join(roomId)
  }

  public shutdown(): void {
    this.io.close();
    console.log("Socket.IO server closed");
  }
}
