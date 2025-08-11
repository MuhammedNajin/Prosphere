import { Server, ServerCredentials } from '@grpc/grpc-js';
import { loadPackageDefinition } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { join } from 'path';
import container from '@di/container';
import { AuthGrpcService } from '@presentation/controllers/auth-controller';


export class UserGrpcServer {
  private server: Server;
  private readonly port: number;
  private readonly host: string;

  constructor() {
    this.server = new Server({
      'grpc.keepalive_time_ms': 30000,
      'grpc.keepalive_timeout_ms': 5000,
      'grpc.keepalive_permit_without_calls': 1,
      'grpc.http2.max_pings_without_data': 0,
      'grpc.http2.min_time_between_pings_ms': 10000,
      'grpc.http2.min_ping_interval_without_data_ms': 300000,
      'grpc.max_receive_message_length': 4 * 1024 * 1024, // 4MB
      'grpc.max_send_message_length': 4 * 1024 * 1024, // 4MB
    });
    
    this.port = parseInt(process.env.USER_SERVICE_PORT || '50051', 10);
    this.host = process.env.USER_SERVICE_HOST || '0.0.0.0';
  }

  async start(): Promise<void> {
    try {
      // Load the protobuf definition
      await this.loadProtoDefinition();
      
      // Register services
      this.registerServices();
      
      // Setup graceful shutdown
      this.setupGracefulShutdown();
      
      // Start the server
      await this.startServer();
      
      console.log(`🚀 User gRPC Server started on ${this.host}:${this.port}`);
    } catch (error) {
      console.error('Failed to start gRPC server:', error);
      process.exit(1);
    }
  }


  private async loadProtoDefinition(): Promise<void> {
    const protoPath = join(__dirname, '../../../protos/user.proto');
    
    const packageDefinition = loadSync(protoPath, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
      includeDirs: [join(__dirname, '../../../protos')],
    });

    const grpcObject = loadPackageDefinition(packageDefinition);
    this.userProto = grpcObject.user as any;
    
    console.log('✅ Proto definition loaded successfully');
  }


  private registerServices(): void {
    // Get service instances from DI container
    const authService = container.get<AuthGrpcService>(AuthGrpcService);
    
    this.server.addService(this.userProto.AuthService.service, {
      signin: authService.signin,
      signup: authService.signup,
      verifyOtp: authService.verifyOtp,
      forgotPassword: authService.forgotPassword,
      resetPassword: authService.resetPassword,
      googleAuth: authService.googleAuth,
      googleAuthFlow: authService.googleAuthFlow,
      refreshToken: authService.refreshToken,
      changePassword: authService.changePassword,
    });

    console.log('✅ Services registered successfully');
  }

  /**
   * Start the gRPC server
   */
  private async startServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.bindAsync(
        `${this.host}:${this.port}`,
        ServerCredentials.createInsecure(),
        (error, port) => {
          if (error) {
            console.error('Failed to bind server:', error);
            reject(error);
            return;
          }

          this.server.start();
          console.log(`Server bound to port ${port}`);
          resolve();
        }
      );
    });
  }

  /**
   * Setup graceful shutdown handling
   */
  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
      console.log(`Received ${signal}, shutting down gracefully...`);
      
      // Try graceful shutdown first
      this.server.tryShutdown((error) => {
        if (error) {
          console.error('Error during graceful shutdown:', error);
          this.server.forceShutdown();
        } else {
          console.log('✅ Server shutdown complete');
        }
        process.exit(0);
      });

      // Force shutdown after timeout
      setTimeout(() => {
        console.warn('⚠️  Forcing server shutdown');
        this.server.forceShutdown();
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGUSR2', () => shutdown('SIGUSR2')); // For nodemon
  }

  /**
   * Stop the server
   */
  async stop(): Promise<void> {
    return new Promise((resolve) => {
      this.server.tryShutdown((error) => {
        if (error) {
          console.error('Error stopping server:', error);
          this.server.forceShutdown();
        }
        resolve();
      });
    });
  }

  private userProto: any;
}