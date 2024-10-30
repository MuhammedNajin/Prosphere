import { Application } from '@infra/database/mongo';
import { IApplicationEntity } from '@domain/interface/IEntity';


export class GetApplicationRepository {
     
    static async get(_id: string): Promise<IApplicationEntity | null> {
        return await Application.findById({ _id });
    }
}