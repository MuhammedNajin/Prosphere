import { IApplicationEntity } from './IEntity';

export interface IApplicationRepository {
   create(appication: IApplicationEntity): Promise<IApplicationEntity | null>
   getAll(companyId: string): Promise<IApplicationEntity[] | null>
   updateStatus(id: string, status: string, statusDescription: string): Promise<unknown>
}