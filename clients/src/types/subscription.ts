export enum PlanType {
    BASIC = "basic",
    Premium = "premium",
  }

  export interface PlanData {
    id?: string
    featuresLimit: {
      jobPostLimit: number;
      videoCallLimit: number;
      messageLimit: number;
    };
    name: string;
    price: number;
    type: PlanType;
    durationInDays: number;
    jobPostLimit?: number;
    videoCallLimit?: number;
    messageLimit?: number;
    features: string[];
  }

  export interface SubscriptionData {
    id: number
    status: string;
    start_date: string;
    end_date: string;
    cancelled_at: string;
    is_trial: boolean;
    trial_ends_at: string;
    features_limit: {
      job_post_limit: number;
      resume_access: number;
      video_call_limit: number;
    };
    usage_stats: {
      job_posts_used: number;
      resume_downloads: number;
      video_calls_used: number;
    };
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
  