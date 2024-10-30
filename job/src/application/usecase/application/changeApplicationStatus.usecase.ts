import { IApplicationEntity } from '@/domain/interface/IEntity.js';
import {  IChangeApplicationStatusUseCase } from '../../interface/applicationUsecase_interface.ts'
import { IApplicationRepository } from '@domain/interface/IApplicationRepository.js'

export class ChangeApplicationStatusUseCaseUseCase implements IChangeApplicationStatusUseCase {
    constructor (private applicationRepository: IApplicationRepository) {}

    async execute(): Promise<null> {
       return this.applicationRepository.updateStatus()
    }
}