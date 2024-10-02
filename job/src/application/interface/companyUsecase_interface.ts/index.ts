import { ICompanyEntity } from '@/domain/interface/IEntity';

export interface ICompanyCreationUseCase {
    execute(job: ICompanyEntity): Promise<ICompanyEntity | null>;
}