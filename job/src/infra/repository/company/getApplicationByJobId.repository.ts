import { IApplicationEntity } from '@/domain/interface/IEntity';
import { Application } from '@infra/database/mongo';
import { ApplicationDoc } from '@infra/database/mongo/schema/application.schema';


export class GetApplicationByJobIdRepository {
   static async getAll(jobId: string, skip: number, limit: number): Promise<IApplicationEntity[]> {
        return await Application
            .find({ jobId })
            .populate('applicantId')
            .skip(skip)
            .limit(limit)
    }

    static async count(jobId: string): Promise<number> {
        return await Application.countDocuments({ jobId });
    }
}