export enum PlanType {
    BASIC = "basic",
    Premium = "premium",
  }

  export interface PlanData {
    id: number
    name: string;
    price: number;
    durationInDays: number;
    jobPostLimit?: number;
    videoCallLimit?: number;
    messageLimit?: number;
    features: string[];
  }

  export interface SubscriptionData {
    isSubscribed: boolean;
    subscriptionStatus: string;
    
    trailLimit: {
        jobPostLimit: number;
        videoCallLimit: number;
        messageLimit: number;
    };

    usageLimit: {
        jobPostLimit: number;
        videoCallLimit: number;
        messageLimit: number;
    };

    isTrail: boolean;
    endDate: string;
  }


  export interface TrialLimit {
    job_post_limit: number;
    video_call_limit: number;
    message_limit: number;
  }
  
  
  export interface UsageStats {
    job_posts_used: number;
    video_calls_used: number;
    messages_used: number;
  }
  

  export interface CompanyUsageData {
    company_id: string;
    trail_limit: TrialLimit;
    usage_stats: UsageStats;
  }
  