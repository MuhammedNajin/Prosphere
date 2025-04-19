import { Job } from '@infra/database/mongo'

export class JobLikeRepository {
     
    static async toggleLikeJob(jobId: string, userId: string) {
       
        const job = await Job.findOne({ _id: jobId });
      
        if (!job) {
          throw new Error("Job not found");
        }
    
        const isLiked = job.likes.includes(userId);

        const update = isLiked
          ? { $pull: { likes: userId } }
          : { $addToSet: { likes: userId } }; 
      
        return await Job.updateOne({ _id: jobId }, update);
      }
      

}