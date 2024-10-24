import { ApplicationCreationRepository } from './createApplication.repository';
import { GetAllApplicationRepository } from './getAllApplication.repository';
import { IApplicationEntity } from '@domain/interface/IEntity'



export class ApplicationRepository {
    private ApplicationCreationRepo = ApplicationCreationRepository;
    private GetAllApplicationRepository = GetAllApplicationRepository;

    public async create(application: IApplicationEntity): Promise<IApplicationEntity | null> {
       return await this.ApplicationCreationRepo.create(application)
    }

    public async getAll(comapanyId: string): Promise<IApplicationEntity[] | null> {
        return await this.GetAllApplicationRepository.getAll(comapanyId)
    }
}