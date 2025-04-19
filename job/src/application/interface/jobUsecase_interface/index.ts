import { JobListingQueryParams } from '@/shared/types/interface';
import { JobEntity, } from '@domain/entity/jobEntity'
import { IComment } from '@domain/interface/IEntity'

export interface IJobPostUseCase {
    execute(job: JobEntity): Promise<JobEntity | null>;
}
export interface IgetJobsUseCase {
    execute({ page, pageSize, filter, search, location }: JobListingQueryParams): Promise<{
      jobs: any[];
      total: number;
      currentPage: number;
      totalPages: number;
    }>;
  }
export interface IgetJobDetailsUseCase {
    execute(id: string): Promise<JobEntity | null>;
}
export interface IupdateJobsUseCase {
    execute(job: JobEntity, id: string): Promise<unknown>;
}
export interface IJobsSeenUseCase {
    execute(id: string, userId: string): Promise<void>;
}

export interface IAddCommentUseCase {
    execute(comment: IComment): Promise<IComment>;
}
export interface IGetCommentUseCase {
    execute(jobId: string): Promise<IComment[]>;
}

export interface ILikeJobUseCase {
    execute(jobId: string, userId: string): Promise<unknown>;
  }

  
  
export default interface JobUseCase {
    jobPostUseCase: IJobPostUseCase,
    getJobsUseCase: IgetJobsUseCase,
    updateJobUseCase: IupdateJobsUseCase,
    addCommentUseCase: IAddCommentUseCase,
    likeJobUseCase : ILikeJobUseCase,
    getCommentUseCase: IGetCommentUseCase,
    getJobDetailsUseCase: IgetJobDetailsUseCase,
    jobSeenUseCase: IJobsSeenUseCase
}



