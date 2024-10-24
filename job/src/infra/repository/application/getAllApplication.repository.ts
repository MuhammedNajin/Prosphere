import { Application } from '@infra/database/mongo';
import { IApplicationEntity } from '@domain/interface/IEntity';


export class GetAllApplicationRepository {
     
    static async getAll(companyId: string): Promise<IApplicationEntity[] | null> {
        return await Application.find({ comapanyId: companyId });
    }
}