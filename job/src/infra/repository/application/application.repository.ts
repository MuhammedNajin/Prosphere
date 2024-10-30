import { ApplicationCreationRepository } from './createApplication.repository';
import { GetAllApplicationRepository } from './getAllApplication.repository';
import { IApplicationEntity } from '@domain/interface/IEntity'
import { ChangeApplicationStatusRepository } from './changeApplicationStatus.repository';
import { IApplicationRepository } from '@/domain/interface/IApplicationRepository';

export class ApplicationRepository implements IApplicationRepository{
    private ApplicationCreationRepo = ApplicationCreationRepository;
    private GetAllApplicationRepository = GetAllApplicationRepository;
    private ChangeApplicationStatusRepository = ChangeApplicationStatusRepository;

    public async create(application: IApplicationEntity): Promise<IApplicationEntity | null> {
       return await this.ApplicationCreationRepo.create(application)
    }

    public async getAll(comapanyId: string): Promise<IApplicationEntity[] | null> {
        return await this.GetAllApplicationRepository.getAll(comapanyId)
    }

    public async updateStatus(id: string, status: string, statusDescription: string): Promise<unknown> {
        return await this.ChangeApplicationStatusRepository.updateStatus(id, status, statusDescription)
    }

}