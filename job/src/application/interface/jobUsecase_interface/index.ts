import { JobEntity } from '@domain/entity/jobEntity'

export interface IJobPostUseCase {
    execute(job: JobEntity): Promise<JobEntity | null>;
}

export interface IgetJobsUseCase {
    execute(): Promise<JobEntity[] | null>;
}



export default interface JobUseCase {
    jobPostUseCase: IJobPostUseCase,
    getJobsUseCase: IgetJobsUseCase
}



