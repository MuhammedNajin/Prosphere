import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';



 export class GrpcPaymentClient {
    private static instance: GrpcPaymentClient;
    private paymentClient: any;
    private readonly maxRetries = 3;
    private readonly retryDelay = 1000;

    constructor() { 
        this.initializeClient();
        console.log(process.env.PROTO_URL);
        
    }

    private initializeClient() {
        try {
            const PROTO_PATH = path.resolve('node_modules/@muhammednajinnprosphere/common/src/protoFiles/payment.proto');
            const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
                keepCase: true,
                longs: String,
                enums: String,
                defaults: true,
                oneofs: true
            });
            const paymentProto = grpc.loadPackageDefinition(packageDefinition).payment as any;

            this.paymentClient = new paymentProto.PaymentService(
                'localhost:50052',
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
            console.log("grpc connection ", this.paymentClient)
        } catch (error) {
            console.error('Failed to initialize gRPC client:', error);
            throw error;
        }
    }

    public async isSubscribed(companyId: string) {
        try {
            console.log("companyId", companyId);
            const requestMessage = {
                 companyId
            }
            return await new Promise((resolve, reject) => {
                this.paymentClient.isSubscribed(requestMessage, (error: any, response: any) => {
                    if (error) {
                        console.error(`gRPC error (attempt ):`, error);
                        reject(error);
                        return;
                    }
                    resolve(response);
                })
            })
        } catch (error) {
            console.log(error);
            throw error
        }
    }


    public async updateFeaturesLimit(id: string, usage_stats: string) {
        try {
            const requestMessage = {
                id,
                usage_stats
            }
            
            return await new Promise((resolve, reject) => {
                this.paymentClient.updateFeaturesLimit(requestMessage, (error: any, response: any) => {
                    if (error) {
                        console.error(`gRPC error (attempt ):`, error);
                        reject(error);
                        return;
                    }
                    resolve(response);
                })
            })
        } catch (error) {
            console.log(error);
            throw error;   
        }
    }
    public async updateTrailLimit(id: string, usage_stats: string) {
        try {
            const requestMessage = {
                companyId: id,
                usage_stats
            }
            
            return await new Promise((resolve, reject) => {
                this.paymentClient.updateTrailLimit(requestMessage, (error: any, response: any) => {
                    if (error) {
                        console.error(`gRPC error (attempt ):`, error);
                        reject(error);
                        return;
                    }
                    resolve(response);
                })
            })
        } catch (error) {
            console.log(error);
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

export default GrpcPaymentClient.getInstance()