import { Application } from '@infra/database/mongo';
import { IApplicationEntity } from '@domain/interface/IEntity';


export class GetMyApplicationRepository {
     
    static async getApplied(userId: string): Promise<IApplicationEntity['id'][] | null> {
        return await Application.find({ applicantId: userId }, { _id: 1, appliedAt: 1, status: 1}).populate({
            path: 'companyId',
            select: ['name']
        }).populate({
            path: 'jobId',
            select: ['jobTitle']
        })
    }
}