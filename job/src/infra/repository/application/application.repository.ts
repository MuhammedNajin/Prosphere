import { ApplicationCreationRepository } from './createApplication.repository';
import { GetAllApplicationRepository } from './getAllApplication.repository';
import { IApplicationEntity } from '@domain/interface/IEntity'
import { ChangeApplicationStatusRepository } from './changeApplicationStatus.repository';
import { IApplicationRepository } from '@/domain/interface/IApplicationRepository';
import { GetApplicationRepository } from './getApplication.repository';
import { GetMyApplicationRepository } from './getMyApplication.repository';
import { IsAppliedRepository } from './isApplied.repository';
import { GetStatusCountsRepository } from './getMyApplicationStatusCount';

export class ApplicationRepository implements IApplicationRepository{
    private ApplicationCreationRepo = ApplicationCreationRepository;
    private GetAllApplicationRepository = GetAllApplicationRepository;
    private GetApplicationRepository = GetApplicationRepository;
    private ChangeApplicationStatusRepository = ChangeApplicationStatusRepository;
    private GetMyApplicationRepository = GetMyApplicationRepository;
    private IsAppliedRepository = IsAppliedRepository
    private GetStatusCountRepo = GetStatusCountsRepository
  
    public async create(application: IApplicationEntity): Promise<IApplicationEntity | null> {
       return await this.ApplicationCreationRepo.create(application)
    }

    public async getAll(comapanyId: string): Promise<IApplicationEntity[] | null> {
        return await this.GetAllApplicationRepository.getAll(comapanyId)
    }

    public async getApplied(params: { userId: string, filter: string, search: string, page: number, pageSize: number}): Promise<IApplicationEntity[] | null> {
        return await this.GetMyApplicationRepository.getApplied(params)
    }
    
    public async get(id: string): Promise<IApplicationEntity | null> {
        return await this.GetApplicationRepository.get(id)
    }

    public async isApplied(id: string, jobId: string): Promise<IApplicationEntity | null> {
        return await this.IsAppliedRepository.isApplied(id, jobId)
    }

    public async updateStatus(id: string, status: string, statusDescription: IApplicationEntity['statusDescription']): Promise<unknown> {
        return await this.ChangeApplicationStatusRepository.updateStatus(id, status, statusDescription)
    }

    public async getApplicationStatus(userId: string) {
        return await this.GetStatusCountRepo.getStatusCounts(userId);
    }

}