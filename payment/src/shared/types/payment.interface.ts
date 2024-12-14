import { PaymentStatus } from "./enums";
import { ISubscription } from "./subscription.interface";

export interface IPaymentMetadata {
    provider: string;
    cardLast4?: string;
    receiptUrl?: string;
}

export interface IPayment {
    id: number;
    subscription: ISubscription;
    amount: number;
    status: PaymentStatus;
    paymentMethod: string;
    transactionId?: string;
    metadata?: IPaymentMetadata;
    createdAt: Date;
}
