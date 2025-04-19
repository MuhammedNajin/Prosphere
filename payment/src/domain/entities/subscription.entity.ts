import { ICompany } from "@/shared/types/company.interface";
import { SubscriptionStatus } from "@/shared/types/enums";
import { IPlanSnapshot, ISubscription } from "@/shared/types/subscription.interface";


export class Subscription {
    id: number;
    planSnapshot: IPlanSnapshot;
    company: ICompany;
    startDate: Date;
    endDate: Date;
    status: SubscriptionStatus;
    amountPaid: number;
    isTrial: boolean;
    trialEndsAt: Date | null;
    cancelledAt: Date | null;
    cancellationReason: string | null;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: {
        plan: {
            id: number
            name: string;
            price: number;
            durationInDays: number;
            features: string[];
        };
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
            id: data.plan.id,
            name: data.plan.name,
            price: data.plan.price,
            durationInDays: data.plan.durationInDays,
            features: data.plan.features
        };

        this.status = SubscriptionStatus.ACTIVE;
        this.isTrial = data.isTrial || false;
        this.trialEndsAt = data.trialEndsAt || null;
        this.cancelledAt = null;
        this.cancellationReason = null;
    }

    toDto(): Omit<ISubscription, "createdAt" | "updatedAt"> {
        return {
            id: this.id,
            planSnapshot: this.planSnapshot,
            company: this.company,
            startDate: this.startDate,
            endDate: this.endDate,
            status: this.status,
            amountPaid: this.amountPaid,
            isTrial: this.isTrial,
            trialEndsAt: this.trialEndsAt,
            cancelledAt: this.cancelledAt,
            cancellationReason: this.cancellationReason,
        };
    }

}