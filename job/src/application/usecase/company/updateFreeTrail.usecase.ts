import { IUpdateFreeTrailUseCase } from '../../interface/companyUsecase_interface.ts'
import { ISubscriptionRepository } from '@/domain/interface/ISubscriptionRepository.js';
import { SubscriptionDoc } from '@/shared/types/subscription.js';

export class UpdateFreeTrailUseCase implements IUpdateFreeTrailUseCase {
    constructor (private subscriptionRepository: ISubscriptionRepository ) {}

    async execute(companyId: string, key: string): Promise<SubscriptionDoc | null> {
        return await this.subscriptionRepository.updateFreeTrail(companyId, key) 
    }
}