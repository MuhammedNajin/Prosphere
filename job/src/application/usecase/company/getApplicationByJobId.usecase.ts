import { IApplicationEntity } from '@/domain/interface/IEntity.js';
import { IGetApplicationByJobIdUseCase } from '../../interface/companyUsecase_interface.ts/index.js'
import { ICompanyRepository } from '@domain/interface/ICompanyRepository.js'

export class GetApplicationByJobIdUseCase implements IGetApplicationByJobIdUseCase {

    constructor (private companyRepository: ICompanyRepository) {}

    async execute(jobId: string): Promise<IApplicationEntity[] | null> {
        return await this.companyRepository.getApplicationByJobId(jobId);  
    }

}
