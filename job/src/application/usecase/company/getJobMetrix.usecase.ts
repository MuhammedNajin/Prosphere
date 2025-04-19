import { IApplicationEntity } from '@/domain/interface/IEntity.js';
import { IGetJobMetrixUseCase } from '../../interface/companyUsecase_interface.ts/index.js'
import { ICompanyRepository } from '@domain/interface/ICompanyRepository.js'
import { TIME_FRAME } from '@/shared/types/enums.js';
import { DateRange } from '@/shared/types/interface.js';

export class GetJobMetrixUseCase implements IGetJobMetrixUseCase {

    constructor (private companyRepository: ICompanyRepository) {}

    async execute(companyId: string, timeFrame: TIME_FRAME, dateRange: DateRange): Promise<void> {
        return await this.companyRepository.getJobMetrix(companyId, timeFrame, dateRange)
    }

}
