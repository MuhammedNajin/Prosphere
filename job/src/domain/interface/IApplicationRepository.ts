import { IApplicationEntity } from './IEntity';

export interface IApplicationRepository {
   create(appication: IApplicationEntity): Promise<IApplicationEntity | null>
   getAll(companyId: string): Promise<IApplicationEntity[] | null>
   getApplied(userId: string): Promise<IApplicationEntity['id'][] | null>
   get(id: string): Promise<IApplicationEntity | null>
   updateStatus(id: string, status: string, statusDescription: IApplicationEntity['statusDescription']): Promise<unknown>
}