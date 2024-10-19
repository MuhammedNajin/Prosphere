import { Job } from '@infra/database/mongo'

export class GetJobsRepository {
    static async getJobs(id: string) {
       return await Job.find({ companyId: id})
    }
}