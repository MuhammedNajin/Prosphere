import { IApplicationEntity } from '@/domain/interface/IEntity.js';
import { IgetMyApplicationUseCase } from '../../interface/applicationUsecase_interface.ts'
import { IApplicationRepository } from '@domain/interface/IApplicationRepository.js'

export class GetMyApplicationUseCase implements IgetMyApplicationUseCase {
    constructor (private applicationRepository: IApplicationRepository) {}

    async execute(userId: string): Promise<IApplicationEntity['id'][] | null> {
        return await this.applicationRepository.getApplied(userId)
    }
}