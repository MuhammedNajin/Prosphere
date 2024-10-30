import { IApplicationEntity } from '@/domain/interface/IEntity.js';
import { IgetApplicationUseCase } from '../../interface/applicationUsecase_interface.ts'
import { IApplicationRepository } from '@domain/interface/IApplicationRepository.js'

export class GetApplicationUseCase implements IgetApplicationUseCase {
    constructor (private applicationRepository: IApplicationRepository) {}

    async execute(id: string): Promise<IApplicationEntity | null> {
        return await this.applicationRepository.get(id)
    }
}