import { IJobPostUseCase } from '../../interface/jobUsecase_interface'
import { JobEntity } from '@domain/entity/jobEntity'
import { IJobRepository } from '@domain/interface/IJobRepository'

export class JobPostUseCase implements IJobPostUseCase {

    constructor (private jobRepository: IJobRepository) { }
  
    async execute(job: JobEntity): Promise<JobEntity | null> {
        return await this.jobRepository.save(job);
    }

}