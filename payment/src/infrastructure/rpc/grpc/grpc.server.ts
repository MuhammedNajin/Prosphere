import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import subscriptionRepository from "@/infrastructure/repository/subscription.repository";

interface UpdateJobsUsedRequest {
  companyId: string;
}

interface GetCurrentSubscriptionRequest {
  companyId: string;
}

interface UpdateJobsUsedResponse {
  success: boolean;
  message: string;
}

interface GetCurrentSubscriptionResponse {
  subscription?: any;
}

export class GrpcServer {
  private server: grpc.Server;
  private paymentProto: any;
  private static instance: GrpcServer | null = null;

  private constructor() {
    try {
      console.log("env", process.env.PROTO_URL);
      
      const PROTO_PATH = path.join(process.cwd(), process.env.PROTO_URL!);
      const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
      this.paymentProto = grpc.loadPackageDefinition(packageDefinition).payment as any;
      this.server = new grpc.Server();
      this.addPaymentServices();
    } catch (error) {
      console.log(error);
      throw new Error("Failed to initialize gRPC server")
    }
  }

  public static getInstance(): GrpcServer {
    if (!GrpcServer.instance) {
      GrpcServer.instance = new GrpcServer();
    }
    return GrpcServer.instance;
  }

  private addPaymentServices() {
    this.server.addService(
      this.paymentProto.PaymentService.service,
      this.getServiceImplementation()
    );
  }

  private getServiceImplementation(): grpc.UntypedServiceImplementation {
    return {
      updateJobsUsed: this.updateJobsUsed.bind(this),
      getCurrentSubscription: this.getCurrentSubscription.bind(this)
    };
  }

  /**
   * updateJobsUsed - Increments job usage for a company
   */
  public async updateJobsUsed(
    call: grpc.ServerUnaryCall<UpdateJobsUsedRequest, UpdateJobsUsedResponse>,
    callback: grpc.sendUnaryData<UpdateJobsUsedResponse>
  ): Promise<void> {
     try {
          const { companyId } = call.request;
          console.log("updateJobsUsed request:", call.request);
          
          // Increment job usage
          await subscriptionRepository.incrementJobsUsed(companyId);
          
          const response: UpdateJobsUsedResponse = {
            success: true,
            message: "Job usage updated successfully"
          };
          
          console.log("updateJobsUsed response:", response);
          callback(null, response);
     } catch (error) {
        console.log("Error updating jobs used:", error);
        
        const errorResponse: UpdateJobsUsedResponse = {
          success: false,
          message: error instanceof Error ? error.message : "Unknown error occurred"
        };
        
        callback(null, errorResponse);
     }
  }

  /**
   * getCurrentSubscription - Gets current active subscription for a company
   */
  public async getCurrentSubscription(
    call: grpc.ServerUnaryCall<GetCurrentSubscriptionRequest, GetCurrentSubscriptionResponse>,
    callback: grpc.sendUnaryData<GetCurrentSubscriptionResponse>
  ): Promise<void> {
     try {
          const { companyId } = call.request;
          console.log("getCurrentSubscription request:", call.request);
          
          // Get current subscription
          const currentSubscription = await subscriptionRepository.getCurrentSubscription(companyId);
          
          const response: GetCurrentSubscriptionResponse = {
            subscription: currentSubscription
          };
          
          console.log("getCurrentSubscription response:", response);
          callback(null, response);
     } catch (error) {
        console.log("Error getting current subscription:", error);
        callback(error as grpc.ServiceError, {});
     }
  }

  public start(port: number = 50052) {
    const grpcDomain = process.env.PAYMENT_GRPC_PATH ?? `0.0.0.0:${port}`
    this.server.bindAsync(
      grpcDomain,
      grpc.ServerCredentials.createInsecure(),
      (err: Error | null) => {
        if (err) {
          console.error("Failed to bind server:", err.message);
        }
        console.log(`Payment Service running on port ${port}`);
      }
    );
  }
}