import { JobEntity } from "../entity/jobEntity";
import { IComment } from "./IEntity";


export interface IJobRepository {
    
    save(job: JobEntity): Promise<JobEntity | null>

    getAll(id: string): Promise<JobEntity[] | null>

    update(job: JobEntity, id: sting): Promise<unknown>

    addComment(comment: IComment): Promise<IComment>

}