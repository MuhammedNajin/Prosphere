import { Application } from '@infra/database/mongo';
import { IApplicationEntity } from '@domain/interface/IEntity';


export class GetAllApplicationRepository {
     
    static async getAll(companyId: string): Promise<IApplicationEntity[] | null> {
        console.log("repp", companyId)
        return await Application.find({ companyId }).populate('applicantId').populate('jobId')
    }
}