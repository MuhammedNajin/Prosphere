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
}

export interface IPlanSnapshot {
    name: string;
    type: PlanType;
    price: number;
    featuresLimit: {
        jobPostLimit: number;
        resumeAccess: number;
        videoCallLimit: number;
        candidateNotes: boolean;
    };

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
    usageStats: ISubscriptionUsageStats;
    amountPaid: number;
    autoRenew: boolean;
    isTrial: boolean;
    trialEndsAt: Date | null;
    cancelledAt: Date | null;
    cancellationReason: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface ISubscriptionUsageStats {
    jobPostsUsed: number;
    resumeDownloads: number;
    videoCallsUsed: number;
    featuredJobsUsed: number;
}