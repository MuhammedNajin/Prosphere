import { IgetJobDetailsUseCase } from '../../interface/jobUsecase_interface'
import { JobEntity } from '@domain/entity/jobEntity'
import { IJobRepository } from '@domain/interface/IJobRepository'

export class GetJobDetailsUseCase implements IgetJobDetailsUseCase {

    constructor (private jobRepository: IJobRepository) { }
  
    async execute(id: string): Promise<JobEntity> {

        return await this.jobRepository.getJobDetails(id);

    }

}