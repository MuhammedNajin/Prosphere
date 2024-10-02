import { Job } from '@infra/database/mongo'
import { JobEntity } from '@/domain/entity/jobEntity';

export class PostJobRepository {
     
    static async postJob(job: JobEntity) {
       return await Job.build(job).save();
    }


}