import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

export class GrpcClient {
    private static instance: GrpcClient;
    private authClient: any;
    private readonly maxRetries = 3;
    private readonly retryDelay = 1000; // 1 second

    constructor() { 
        this.initializeClient();
    }

    private initializeClient() {
        try {
            const PROTO_PATH = path.resolve('node_modules/@muhammednajinnprosphere/common/src/protoFiles/user.proto');
            const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
                keepCase: true,
                longs: String,
                enums: String,
                defaults: true,
                oneofs: true
            });
            const authProto = grpc.loadPackageDefinition(packageDefinition).auth as any;
            const grpcDomain = process.env.USER_GRPC_DOMAIN ?? 'localhost:50051';
            this.authClient = new authProto.UserService(
                 grpcDomain,
                grpc.credentials.createInsecure(),
                {
                    'grpc.keepalive_time_ms': 10000,
                    'grpc.keepalive_timeout_ms': 5000,
                    'grpc.keepalive_permit_without_calls': 1,
                    'grpc.http2.max_pings_without_data': 0,
                    'grpc.http2.min_time_between_pings_ms': 10000,
                    'grpc.http2.min_ping_interval_without_data_ms': 5000
                }
            );
        } catch (error) {
            console.error('Failed to initialize gRPC client:', error);
            throw error;
        }
    }

    private async createUserWithRetry(user: any, retryCount = 0): Promise<any> {
        try {
            return await new Promise((resolve, reject) => {
                this.authClient.createUser(user, 
                    {
                        deadline: Date.now() + 5000 // 5 second timeout
                    },
                    (error: any, response: any) => {
                        if (error) {
                            console.error(`gRPC error (attempt ${retryCount + 1}):`, error);
                            reject(error);
                            return;
                        }
                        resolve(response);
                    }
                );
            });
        } catch (error: any) {
            if (retryCount < this.maxRetries && 
                (error.code === grpc.status.UNAVAILABLE || 
                 error.code === grpc.status.DEADLINE_EXCEEDED)) {
                console.log(`Retrying... Attempt ${retryCount + 1} of ${this.maxRetries}`);
                await new Promise(resolve => setTimeout(resolve, this.retryDelay));
                return this.createUserWithRetry(user, retryCount + 1);
            }
            throw error;
        }
    }

    public async CreateUser(user: any): Promise<any> {
        try {
            return await this.createUserWithRetry(user);
        } catch (error) {
            console.error('Final create user error:', error);
            throw error;
        }
    }

    public async getUserProfile(_id: string): Promise<unknown> {
        try {
            return new Promise((resolve, reject) => {
               this.authClient.getUserProfile(_id, (error: any, response: any) => {
                if (error) {
                    console.error(`gRPC error:`, error);
                    reject(error);
                    return;
                }
                resolve(response);
            })
            })
        } catch (error) {
            console.log("get user grpc error", error);
            throw error
        }
    }

    public static getInstance(): GrpcClient {
        if (!GrpcClient.instance) {
            GrpcClient.instance = new GrpcClient();
        }
        return GrpcClient.instance;
    }
}