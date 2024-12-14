import { ICompany } from "@/shared/types/company.interface";
import { PlanType, SubscriptionStatus } from "@/shared/types/enums";
import { IPlan } from "@/shared/types/plan.interface";
import { ISubscription, ISubscriptionUsageStats } from "@/shared/types/subscription.interface";

interface PlanSnapshot {
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

interface PlanHistory {
    planType: PlanType;
    startDate: Date;
    endDate: Date;
    reason: string;
}

export class Subscription implements Omit<ISubscription, "createdAt" | "updatedAt"> {
    id: number;
    planSnapshot: PlanSnapshot;
    company: ICompany;
    startDate: Date;
    endDate: Date;
    status: SubscriptionStatus;
    usageStats: ISubscriptionUsageStats & { lastResetDate: Date };
    amountPaid: number;
    autoRenew: boolean;
    isTrial: boolean;
    trialEndsAt: Date | null;
    cancelledAt: Date | null;
    cancellationReason: string | null;
    previousPlans: PlanHistory[] | null;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: {
        plan: IPlan;
        company: ICompany;
        startDate: Date;
        endDate: Date;
        amountPaid: number;
        isTrial?: boolean;
        trialEndsAt?: Date;
    }) {

        this.company = data.company;
        this.startDate = data.startDate;
        this.endDate = data.endDate;
        this.amountPaid = data.amountPaid;
        this.planSnapshot = {
            name: data.plan.name,
            type: data.plan.type,
            price: data.plan.price,
            featuresLimit: data.plan.featuresLimit,
            features: data.plan.features
        };

        this.status = SubscriptionStatus.ACTIVE;
        this.autoRenew = false;
        this.isTrial = data.isTrial || false;
        this.trialEndsAt = data.trialEndsAt || null;
        this.cancelledAt = null;
        this.cancellationReason = null;
        this.previousPlans = null;
        this.usageStats = {
            jobPostsUsed: 0,
            resumeDownloads: 0,
            videoCallsUsed: 0,
            featuredJobsUsed: 0,
            lastResetDate: new Date()
        };
    }

    isActive(): boolean {
        return (
            this.status === SubscriptionStatus.ACTIVE &&
            new Date() <= this.endDate &&
            (!this.isTrial || new Date() <= (this.trialEndsAt || new Date()))
        );
    }

    toDto(): Omit<ISubscription, "createdAt" | "updatedAt"> {
        return {
            id: this.id,
            planSnapshot: this.planSnapshot,
            company: this.company,
            startDate: this.startDate,
            endDate: this.endDate,
            status: this.status,
            usageStats: this.usageStats,
            amountPaid: this.amountPaid,
            autoRenew: this.autoRenew,
            isTrial: this.isTrial,
            trialEndsAt: this.trialEndsAt,
            cancelledAt: this.cancelledAt,
            cancellationReason: this.cancellationReason,
        };
    }
}