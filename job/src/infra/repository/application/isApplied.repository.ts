import { Application } from '@infra/database/mongo';
import { IApplicationEntity } from '@domain/interface/IEntity';


export class IsAppliedRepository {
     
    static async isApplied(id: string, jobId: string): Promise<IApplicationEntity | null> {
        console.log("debug: repository with already applied :  isApplied",  id, jobId)
        return await Application.findOne({ applicantId : id, jobId })
    }
}