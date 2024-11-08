import { PostJobRepository } from "./postJob.repository";
import { JobEntity } from '@domain/entity/jobEntity'
import { GetJobsRepository } from './getJobs.repository'
import { UpdateJobRepository } from "./UpdateJobs.repository";
import { AddCommentRepository } from "./addComment.repository";
import { CommentAttrs } from "@/infra/database/mongo/schema/JobComment.schema";
export class JobRepository {
   private PostJobRepo = PostJobRepository;
   private GetJobRepo = GetJobsRepository;
   private UpdateJobRepo = UpdateJobRepository
   private AddCommentRepo = AddCommentRepository
   public async save(job: JobEntity): Promise<JobEntity | null>  {
      return await this.PostJobRepo.postJob(job);
   }

   public async getAll(id: string): Promise<JobEntity[] | null> {
      return await this.GetJobRepo.getJobs(id);
   }

   public async update(job: JobEntity, id: string): Promise<unknown> {
       return await this.UpdateJobRepo.updateJob(job, id);
   } 

   public async addComment(comment: CommentAttrs): Promise<CommentAttrs> {
      return await this.AddCommentRepo.addComment(comment)
   }
}