import { PostJobRepository } from "./postJob.repository";
import { JobEntity } from '@domain/entity/jobEntity'

export class JobRepository {
   private PostJobRepo = PostJobRepository;


   public async save(job: JobEntity): Promise<JobEntity | null>  {
      return await this.PostJobRepo.postJob(job);
   }
}