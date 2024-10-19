import { IApplicationEntity } from './IEntity';

export interface IApplicationRepository {
   create(job: IApplicationEntity): Promise<IApplicationEntity | null>
}