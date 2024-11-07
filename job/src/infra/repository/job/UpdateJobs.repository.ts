import { Job } from '@infra/database/mongo'
import { JobEntity } from '@/domain/entity/jobEntity';

export class UpdateJobRepository {
     
    static async updateJob(job: JobEntity, _id: string) {
      try {

        return await Job.updateOne({
            _id 
          },
          {
            $set: { ...job }
          },
          {
           runValidators: true
          }
       );

      } catch (error) {
        throw error
      }
    }


}