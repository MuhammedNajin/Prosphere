import { IupdateJobsUseCase } from '../../interface/jobUsecase_interface'
import { JobEntity } from '@domain/entity/jobEntity'
import { IJobRepository } from '@domain/interface/IJobRepository'

export class UpdateJobUseCase implements IupdateJobsUseCase {

    constructor (private jobRepository: IJobRepository) { }
  
    async execute(job: JobEntity, id: string): Promise<unknown> {
        return this.jobRepository.update(job, id)
    }

}