import { ICompanyEntity } from './IEntity';

export interface ICompanyRepository {
   create(job: ICompanyEntity): Promise<ICompanyEntity | null>
}