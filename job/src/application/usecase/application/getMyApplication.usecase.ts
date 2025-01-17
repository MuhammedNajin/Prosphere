import { IApplicationEntity } from '@/domain/interface/IEntity.js';
import { IgetMyApplicationUseCase } from '../../interface/applicationUsecase_interface.ts'
import { IApplicationRepository } from '@domain/interface/IApplicationRepository.js'

export class GetMyApplicationUseCase implements IgetMyApplicationUseCase {
    constructor (private applicationRepository: IApplicationRepository) {}

    async execute(params: { userId: string, filter: string, search: string, page: number, pageSize: number}): Promise<IApplicationEntity[] | null> {
        return await this.applicationRepository.getApplied(params)
    }
}