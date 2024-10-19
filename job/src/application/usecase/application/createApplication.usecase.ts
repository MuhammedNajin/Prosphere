import { IApplicationEntity } from '@/domain/interface/IEntity.js';
import { ICreateApplicationUseCase } from '../../interface/applicationUsecase_interface.ts'
import { IApplicationRepository } from '@domain/interface/IApplicationRepository.js'

export class ApplicationCreationUseCase implements ICreateApplicationUseCase {
    constructor (private applicationRepository: IApplicationRepository) {}

    async execute(application: IApplicationEntity): Promise<IApplicationEntity | null> {
        return  await this.applicationRepository.create(application);  
    }
}