import { PostJobRepository } from "./postJob.repository";
import { JobEntity } from '@domain/entity/jobEntity'
import { GetJobsRepository } from './getJobs.repository'
import { UpdateJobRepository } from "./UpdateJobs.repository";
import { AddCommentRepository } from "./addComment.repository";
import { CommentAttrs } from "@/infra/database/mongo/schema/JobComment.schema";
import { JobLikeRepository } from "./jobLike.repository"; 
import { GetCommentRepository } from "./getComments.repository";
import { GetJobDetailsRepository } from "./getJobDetails.repository";
import { JobListingQueryParams } from '@/shared/types/interface'
import { JobSeenRepository } from "./jobSeen.repository";
import { GetJobStatsRepository } from "./getjobStats.repository";
export class JobRepository {
   private PostJobRepo = PostJobRepository;
   private GetJobRepo = GetJobsRepository;
   private UpdateJobRepo = UpdateJobRepository
   private AddCommentRepo = AddCommentRepository
   private JobLikeRepository = JobLikeRepository
   private GetCommentRepo = GetCommentRepository;
   private GetJobDetailsRepo = GetJobDetailsRepository
   private JobSeenRepo = JobSeenRepository;
   private GetJobStatsRepo = GetJobStatsRepository;

   public async save(job: JobEntity): Promise<JobEntity | null>  {
      return await this.PostJobRepo.postJob(job);
   }

   public async getAll({
      page,
      pageSize,
      filter,
      search,
      location
  }: JobListingQueryParams): Promise<JobEntity[] | null> {
      return await this.GetJobRepo.getJobs({
         page,
         pageSize,
         filter,
         search,
         location
     });
   }

   public async update(job: JobEntity, id: string): Promise<unknown> {
       return await this.UpdateJobRepo.updateJob(job, id);
   } 

   public async jobSeen(id: string, userId: string): Promise<void> {
       return await this.JobSeenRepo.jobSeen(id, userId);
   } 

   public async addComment(comment: CommentAttrs): Promise<CommentAttrs> {
      return await this.AddCommentRepo.addComment(comment)
   }

   public async getComment(jobId: string): Promise<CommentAttrs[]> {
      return await this.GetCommentRepo.getComment(jobId)
   }

   public async jobLikeToggle(jobId: string, userId: string): Promise<unknown> {
       return await  this.JobLikeRepository.toggleLikeJob(jobId, userId);
   }

   public async getJobDetails(id: string): Promise<JobEntity> {
      return await this.GetJobDetailsRepo.getJobDetails(id);
   }

   public async getJobStats(): Promise<void> {
      return await this.GetJobStatsRepo.getJobStats()
   }

}