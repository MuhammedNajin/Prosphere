import { Application } from '@infra/database/mongo';
import { IApplicationEntity } from '@domain/interface/IEntity';
import { BadRequestError } from '@muhammednajinnprosphere/common';


export class ApplicationCreationRepository {
     
    static async create(application: IApplicationEntity): Promise<IApplicationEntity | null> {
        return (await Application.build(application).save()).populate(['jobId', 'companyId'])
    }
}