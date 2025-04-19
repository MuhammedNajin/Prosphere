import { ICompanyEntity } from '@/domain/interface/IEntity.js';
import { ICompanyCreationUseCase, ISubscriptionCheckUseCase } from '../../interface/companyUsecase_interface.ts'
import { ICompanyRepository } from '@domain/interface/ICompanyRepository.js'
import { ISubscriptionRepository } from '@/domain/interface/ISubscriptionRepository.js';
import { SubscriptionDoc } from '@/shared/types/subscription.js';

export class SubscriptionCheckUseCase implements ISubscriptionCheckUseCase {
    constructor (private subscriptionRepository: ISubscriptionRepository ) {}

    async execute(companyId: string): Promise<SubscriptionDoc | null> {
        return  await this.subscriptionRepository.findSubscription(companyId);  
    }
}