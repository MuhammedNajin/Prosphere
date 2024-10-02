import { CompanyCreationRepository } from './companyCreation.repository'
import { ICompanyEntity } from '@domain/interface/IEntity'



export class CompanyRepository {
    private CompanyCreationRepo = CompanyCreationRepository;

    public async create(company: ICompanyEntity): Promise<ICompanyEntity | null> {
       return await this.CompanyCreationRepo.create(company)
    }
}