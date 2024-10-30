import { ApplicationCreationRepository } from './createApplication.repository';
import { GetAllApplicationRepository } from './getAllApplication.repository';
import { IApplicationEntity } from '@domain/interface/IEntity'
import { ChangeApplicationStatusRepository } from './changeApplicationStatus.repository';
import { IApplicationRepository } from '@/domain/interface/IApplicationRepository';
import { GetApplicationRepository } from './getApplication.repository';

export class ApplicationRepository implements IApplicationRepository{
    private ApplicationCreationRepo = ApplicationCreationRepository;
    private GetAllApplicationRepository = GetAllApplicationRepository;
    private GetApplicationRepository = GetApplicationRepository;
    private ChangeApplicationStatusRepository = ChangeApplicationStatusRepository;

    public async create(application: IApplicationEntity): Promise<IApplicationEntity | null> {
       return await this.ApplicationCreationRepo.create(application)
    }

    public async getAll(comapanyId: string): Promise<IApplicationEntity[] | null> {
        return await this.GetAllApplicationRepository.getAll(comapanyId)
    }

    public async get(id: string): Promise<IApplicationEntity | null> {
        return await this.GetApplicationRepository.get(id)
    }

    public async updateStatus(id: string, status: string, statusDescription: string): Promise<unknown> {
        return await this.ChangeApplicationStatusRepository.updateStatus(id, status, statusDescription)
    }

}