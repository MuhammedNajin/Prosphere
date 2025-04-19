import { ApplicationFilter, GetAllApplicationReturnType } from '@/shared/types/application';
import { IApplicationEntity } from './IEntity';

export interface IApplicationRepository {
   create(appication: IApplicationEntity): Promise<IApplicationEntity | null>
   getAll(companyId: string, params: ApplicationFilter): Promise<GetAllApplicationReturnType | null>
   getApplied(params: { userId: string, filter: string, search: string, page: number }): Promise<IApplicationEntity[] | null>
   get(id: string): Promise<IApplicationEntity | null>
   isApplied(id: string, jobId: string): Promise<IApplicationEntity | null>
   updateStatus(id: string, status: string, statusDescription: IApplicationEntity['statusDescription']): Promise<unknown>
}