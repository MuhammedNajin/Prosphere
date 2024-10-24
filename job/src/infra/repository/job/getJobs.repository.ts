import { Job } from '@infra/database/mongo'

export class GetJobsRepository {
    static async getJobs() {
       return await Job.find();
    }
}