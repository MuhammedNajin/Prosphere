import { ISubscription } from "@/shared/types/subscription.interface";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import subscriptionRepository from "@/infrastructure/repository/subscription.repository";
import companyRepository from "@/infrastructure/repository/company.repository";
import { UsageMetrics } from "@/shared/types/enums";
import { Company } from "@/infrastructure/database/sql/entities/company.entitiy";
interface RequestMessage {
  companyId: string;
}

interface UpdateFearturesLimitRequest {
  id: string
  usageStats: UsageMetrics
}

interface UpdateTrailLimitRequest {
  companyId: string
  usageStats: UsageMetrics
}

// Enums
enum PlanType {
  PLAN_TYPE_UNSPECIFIED = 0,
  PLAN_TYPE_FREE = 1,
  PLAN_TYPE_BASIC = 2,
  PLAN_TYPE_PREMIUM = 3,
  PLAN_TYPE_ENTERPRISE = 4,
}

enum SubscriptionStatus {
  SUBSCRIPTION_STATUS_UNSPECIFIED = 0,
  SUBSCRIPTION_STATUS_ACTIVE = 1,
  SUBSCRIPTION_STATUS_CANCELLED = 2,
  SUBSCRIPTION_STATUS_EXPIRED = 3,
  SUBSCRIPTION_STATUS_PENDING = 4,
}

// Interfaces
interface Request {
  companyId: string;
}

interface FeaturesLimit {
  jobPostLimit: number;
  resumeAccess: number;
  videoCallLimit: number;
  candidateNotes: boolean;
}

interface PlanSnapshot {
  name: string;
  type: PlanType;
  price: number;
  featuresLimit: FeaturesLimit;
  features: string[];
}

interface UsageStats {
  jobPostsUsed: number;
  resumeDownloads: number;
  videoCallsUsed: number;
  featuredJobsUsed: number;
  lastResetDate: string;
}

interface Subscription {
  id: number;
  planSnapshot: PlanSnapshot;
  startDate: string;
  status: SubscriptionStatus;
  usageStats: UsageStats;
  isTrial: boolean;
  trialEndsAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string; 
}


export class GrpcServer {
  private server: grpc.Server;
  private paymentProto: any;
  private static instance: GrpcServer | null = null;


  private constructor() {
    try {
      console.log("env", process.env.PROTO_URL);
      
      const PROTO_PATH = path.resolve(process.env.PROTO_URL!);
      const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
      this.paymentProto = grpc.loadPackageDefinition(packageDefinition).payment as any;
      this.server = new grpc.Server();
      this.addPaymentServices();
    } catch (error) {
      console.log(error);
      throw new Error()
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
      isSubscribed: this.isSubscribed.bind(this),
      updateFeaturesLimit: this.isSubscribed.bind(this),
      updateTrailLimit: this.updateTrailLimit.bind(this)
    };
  }

  private async isSubscribed(
    call: grpc.ServerUnaryCall<RequestMessage, ISubscription>,
    callback: grpc.sendUnaryData<{ subscription: Subscription | null, company: Company | null }>
  ): Promise<void> {

    const { companyId } = call.request;
    console.log("request", call.request);
    const data = await subscriptionRepository.getbyCompanyId(companyId);
    let response: { subscription: Subscription | null, company: Company | null }
    console.log("sunscription", data)

    if(data?.subscription) {
        response = { subscription: data.subscription, is_trial: false }
    } else if(data?.company) {
    
       response = { company: data.company, is_trial: true };
    } else {
       response = {}
    }

  
      

    // if(!subscription) {
    //     response = {
    //       subscription: null
    //     };
    // }
    
    
    console.log("grpc response",JSON.stringify(response));
    
    callback(null, response);

  } 

  /**
   * updateFearturesLimit
   */

  public async updateFearturesLimit(
    call: grpc.ServerUnaryCall<UpdateFearturesLimitRequest, {}>,
    callback: grpc.sendUnaryData<{}>
  ) {
     try {
          const { id, usageStats } = call.request;
          console.log("updateFeaturesLimit", call.request);
         await subscriptionRepository.updateFeaturesLimit(id, usageStats);
         callback({});
     } catch (error) {
        console.log(error);
        throw error;
        
     }
  }

  public async updateTrailLimit(
    call: grpc.ServerUnaryCall<UpdateTrailLimitRequest, {}>,
    callback: grpc.sendUnaryData<{}>
  ) {
     try {
          const { companyId,  usageStats } = call.request;
          console.log("updateFeaturesLimit", call.request);
         await companyRepository.updateTrail(companyId, usageStats);
         callback({});
     } catch (error) {
        console.log(error);
        throw error;
        
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
        console.log(`Profile Service running on port ${port}`);
      }
    );
  }
}