import { PostJobRepository } from "./postJob.repository";
import { JobEntity } from '@domain/entity/jobEntity'
import { GetJobsRepository } from './getJobs.repository'

export class JobRepository {
   private PostJobRepo = PostJobRepository;
   private GetJobRepo = GetJobsRepository;

   public async save(job: JobEntity): Promise<JobEntity | null>  {
      return await this.PostJobRepo.postJob(job);
   }

   public async getAll(id: string): Promise<JobEntity[] | null> {
      return await this.GetJobRepo.getJobs(id);
   }
}