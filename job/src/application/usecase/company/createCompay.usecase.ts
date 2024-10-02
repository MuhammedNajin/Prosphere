import { ICompanyEntity } from '@/domain/interface/IEntity.js';
import { ICompanyCreationUseCase } from '../../interface/companyUsecase_interface.ts'
import { ICompanyRepository } from '@domain/interface/ICompanyRepository.js'

export class CompanyCreationUseCase implements ICompanyCreationUseCase {
    constructor (private companyRepository: ICompanyRepository) {}

    async execute(company: ICompanyEntity): Promise<ICompanyEntity | null> {
        return  await this.companyRepository.create(company);  
    }
}