import { ApplicationCreationRepository } from './createApplication.repository';
import { IApplicationEntity } from '@domain/interface/IEntity'



export class ApplicationRepository {
    private ApplicationCreationRepo = ApplicationCreationRepository;

    public async create(application: IApplicationEntity): Promise<IApplicationEntity | null> {
       return await this.ApplicationCreationRepo.create(application)
    }
}