export enum PlanType {
    BASIC = 'basic',
    PREMIUM = 'premium'
  }
  
  export enum SubscriptionStatus {
    ACTIVE = 'ACTIVE',
    CANCELLED = 'CANCELLED',
    EXPIRED = 'EXPIRED',
    TRIAL = 'TRIAL'
  }
  
  export enum PaymentStatus {
    PENDING = 'pending',
    SUCCESS = 'success',
    FAILED = 'failed'
  }

  export enum UsageMetrics {
    JobPostsUsed = "jobPostsUsed",
    VideoCallsUsed = "videoCallsUsed",
    MessagesUsed = "messagesUsed",
  }