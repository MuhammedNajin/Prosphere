import { IApplicationEntity } from '@/domain/interface/IEntity.js';
import {  IChangeApplicationStatusUseCase } from '../../interface/applicationUsecase_interface.ts'
import { IApplicationRepository } from '@domain/interface/IApplicationRepository.js'



export class ChangeApplicationStatusUseCaseUseCase implements IChangeApplicationStatusUseCase {
    constructor (private applicationRepository: IApplicationRepository) {}

    async execute(id: string, status: string, statusDescription: IApplicationEntity['statusDescription']): Promise<IApplicationEntity['statusDescription']> {
       return this.applicationRepository.updateStatus(id, status, statusDescription)
    }
}