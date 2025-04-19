import { IJob } from '@/domain/interface/IEntity.js';
import { IgetAllJobByCompanyIdUseCase } from '../../interface/companyUsecase_interface.ts'
import { ICompanyRepository } from '@domain/interface/ICompanyRepository.js'
import { JobFilterByCompany } from '@/shared/types/job.js';

export class GetAllJobByCompanyIdUseCase implements IgetAllJobByCompanyIdUseCase {
    constructor (private companyRepository: ICompanyRepository) {}

    async execute(companyId: string, { filter, from, to, page, pageSize }: JobFilterByCompany): Promise<IJob[] | null> {
        return  await this.companyRepository.getAll(companyId, { to, from, filter, page, pageSize });  
    }
}