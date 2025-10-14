import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

interface UpdateJobsUsedResponse {
    success: boolean;
    message: string;
}

interface GetCurrentSubscriptionResponse {
    subscription?: any;
}

export class GrpcPaymentClient {
    private static instance: GrpcPaymentClient;
    private paymentClient: any;

    constructor() { 
        this.initializeClient();
        console.log(process.env.PROTO_URL);
    }

    private initializeClient() {
        try {
            const PROTO_PATH = path.join(process.cwd(), process.env.PROTO_URL!);
            const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
                keepCase: true,
                longs: String,
                enums: String,
                defaults: true,
                oneofs: true
            });
            const paymentProto = grpc.loadPackageDefinition(packageDefinition).payment as any;
            const grpcDomain = process.env.PAYMENT_GRPC_DOMAIN ?? "localhost:50052";
            this.paymentClient = new paymentProto.PaymentService(
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

    public async updateJobsUsed(companyId: string): Promise<UpdateJobsUsedResponse> {
        try {
            console.log("Updating jobs used for companyId:", companyId);
            const requestMessage = {
                companyId
            }
            
            return await new Promise<UpdateJobsUsedResponse>((resolve, reject) => {
                this.paymentClient.updateJobsUsed(requestMessage, (error: any, response: UpdateJobsUsedResponse) => {
                    if (error) {
                        console.error(`gRPC error updating jobs used:`, error);
                        reject(error);
                        return;
                    }
                    console.log("Response from updateJobsUsed:", response);
                    resolve(response);
                })
            })
        } catch (error) {
            console.log("Error in updateJobsUsed client method:", error);
            throw error;   
        }
    }

    public async getCurrentSubscription(companyId: string): Promise<GetCurrentSubscriptionResponse> {
        try {
            console.log("Getting current subscription for companyId:", companyId);
            const requestMessage = {
                companyId
            }
            
            return await new Promise<GetCurrentSubscriptionResponse>((resolve, reject) => {
                this.paymentClient.getCurrentSubscription(requestMessage, (error: any, response: GetCurrentSubscriptionResponse) => {
                    if (error) {
                        console.error(`gRPC error getting current subscription:`, error);
                        reject(error);
                        return;
                    }
                    console.log("Response from getCurrentSubscription:", response);
                    resolve(response);
                })
            })
        } catch (error) {
            console.log("Error in getCurrentSubscription client method:", error);
            throw error;   
        }
    }
    
    public static getInstance(): GrpcPaymentClient {
        if (!GrpcPaymentClient.instance) {
            GrpcPaymentClient.instance = new GrpcPaymentClient();
        }
        return GrpcPaymentClient.instance;
    }
}

export default GrpcPaymentClient.getInstance();