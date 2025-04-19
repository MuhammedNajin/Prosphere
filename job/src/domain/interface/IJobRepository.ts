import { JobListingQueryParams } from "@/shared/types/interface";
import { JobEntity } from "../entity/jobEntity";
import { IComment } from "./IEntity";


export interface IJobRepository {
    
    save(job: JobEntity): Promise<JobEntity | null>

    getAll(query: JobListingQueryParams): Promise<JobEntity[] | null>

    update(job: JobEntity, id: string): Promise<unknown>

    addComment(comment: IComment): Promise<IComment>

    getComment(jobId: string): Promise<IComment[]>

    jobLikeToggle(jobId: string, userId: string): Promise<unknown>
    
    getJobDetails(id: string): Promise<JobEntity> 

    jobSeen(id: string, userId: string): Promise<void>

    getJobStats(): Promise<void>;
}