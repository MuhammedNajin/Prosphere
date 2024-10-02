import { JobEntity } from "../entity/jobEntity";


export interface IJobRepository {
    
    save(job: JobEntity): Promise<JobEntity | null>

}