import { Application } from '@infra/database/mongo';
import { IApplicationEntity } from '@domain/interface/IEntity';


export class ApplicationCreationRepository {
     
    static async create(application: IApplicationEntity): Promise<IApplicationEntity | null> {
        return await Application.build(application).save();
    }
}