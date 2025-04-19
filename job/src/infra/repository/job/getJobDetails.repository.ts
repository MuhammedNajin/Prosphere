import { Job } from '@infra/database/mongo'

export class GetJobDetailsRepository {
    static async getJobDetails(_id: string) {
       return await Job.findOne({ _id }).populate('companyId');
    }
}