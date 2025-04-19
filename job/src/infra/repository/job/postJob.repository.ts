import { Job } from '@infra/database/mongo'
import { JobEntity } from '@/domain/entity/jobEntity';
import Subscription from '@/infra/database/mongo/schema/subscription.schema';

export class PostJobRepository {
     
    static async postJob(job: JobEntity) {
       return (await Job.build(job).save()).populate('companyId');  
    }
}