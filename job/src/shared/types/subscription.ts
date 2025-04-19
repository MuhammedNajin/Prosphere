import mongoose from "mongoose";

interface LimitConfig {
  jobPostLimit: number;
  videoCallLimit: number;
  messageLimit: number;
}

export interface SubscriptionAttrs {
  companyId: string;
  trailLimit?: LimitConfig;
  usageLimit?: LimitConfig;
  isSubscribed?: boolean;
  duration?: number;
  startDate?: Date;
  endDate?: Date;
  status?: 'active' | 'expired' | 'cancelled';
}

export interface SubscriptionDoc extends Document {
  companyId: mongoose.Types.ObjectId;
  trailLimit: LimitConfig;
  usageLimit: LimitConfig;
  isSubscribed: boolean;
  duration: number;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expired' | 'cancelled';
  currentUsage: {
    jobPosts: number;
    videoCalls: number;
    messages: number;
  };
  createdAt: Date;
  updatedAt: Date;
}