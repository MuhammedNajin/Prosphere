import { IApplicationEntity } from '@/domain/interface/IEntity.js';
import { IisAppliedUseCase  } from '../../interface/applicationUsecase_interface.ts'
import { IApplicationRepository } from '@domain/interface/IApplicationRepository.js'

export class IsAppliedUseCase implements IisAppliedUseCase {
    constructor (private applicationRepository: IApplicationRepository) {}

    async execute(id: string, jobId: string): Promise<IApplicationEntity | null> {
        return await this.applicationRepository.isApplied(id, jobId)
    }
}