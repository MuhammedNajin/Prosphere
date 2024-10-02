import { JobEntity } from '@domain/entity/jobEntity'

export interface IJobPostUseCase {
    execute(job: JobEntity): Promise<JobEntity | null>;
}



