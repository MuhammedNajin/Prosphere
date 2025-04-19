import { IUpgradeSubscription } from "@/shared/types/payment.interface";


export interface IUpgradeSubscriptionUseCase {
    execute(data: IUpgradeSubscription): Promise<number>
}