import { JobEntity } from '@domain/entity/jobEntity'

export interface IJobPostUseCase {
    execute(job: JobEntity): Promise<JobEntity | null>;
}

export interface IgetJobsUseCase {
    execute(): Promise<JobEntity[] | null>;
}
export interface IupdateJobsUseCase {
    execute(job: JobEntity, id: string): Promise<unknown>;
}

export interface IAddCommentUseCase {
    execute(comment): Promise<>;
}



export default interface JobUseCase {
    jobPostUseCase: IJobPostUseCase,
    getJobsUseCase: IgetJobsUseCase,
    updateJobUseCase: IupdateJobsUseCase,
    addCommentUseCase: IAddCommentUseCase
}



