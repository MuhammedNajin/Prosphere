import { IJobPostUseCase, IgetJobsUseCase } from '../../interface/jobUsecase_interface'
import { JobEntity } from '@domain/entity/jobEntity'
import { IJobRepository } from '@domain/interface/IJobRepository'

export class GetJobsUseCase implements IgetJobsUseCase {

    constructor (private jobRepository: IJobRepository) { }
  
    async execute(id: string): Promise<JobEntity[] | null> {
        const createdJob = await this.jobRepository.getAll(id);
        console.log(createdJob);

        return createdJob
    }

}