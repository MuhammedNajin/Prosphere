import { IApplicationEntity } from '@/domain/interface/IEntity.js';
import { IgetAllApplicationUseCase } from '../../interface/applicationUsecase_interface.ts'
import { IApplicationRepository } from '@domain/interface/IApplicationRepository.js'

export class GetAllApplicationUseCase implements IgetAllApplicationUseCase {
    constructor (private applicationRepository: IApplicationRepository) {}

    async execute(companyId: string): Promise<IApplicationEntity[] | null> {
        return await this.applicationRepository.getAll(companyId)
    }
}