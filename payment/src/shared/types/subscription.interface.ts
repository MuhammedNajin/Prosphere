import { PlanType, SubscriptionStatus } from "./enums";
import { ICompany } from "./company.interface";
import { IPlan } from "./plan.interface";

export interface ISubscriptionUsageStats {
    jobPostsUsed: number;
    resumeDownloads: number;
    videoCallsUsed: number;
    featuredJobsUsed: number;
}

export interface ISubscriptionUsageStats {
    jobPostsUsed: number;
    resumeDownloads: number;
    videoCallsUsed: number;
    featuredJobsUsed: number;
    lastResetDate: Date;
    trialUsage: {
        jobPostsUsed: number;
        videoCallsUsed: number;
        messagesUsed: number;
      };
}

export interface IPlanSnapshot {
    id: number;
    name: string;
    price: number;
    durationInDays: number;
    features: string[];
}

export interface IPlanHistory {

    planType: PlanType;
    startDate: Date;
    endDate: Date;
    reason: string;
}

export interface ISubscription {
    id: number;
    planSnapshot: IPlanSnapshot;
    company: ICompany;
    startDate: Date;
    endDate: Date;
    status: SubscriptionStatus;
    amountPaid: number;
    isTrial: boolean;
    trialEndsAt: Date;
    cancelledAt: Date;
    cancellationReason: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ISubscriptionUsageStats {
    jobPostsUsed: number;

    videoCallsUsed: number;

}