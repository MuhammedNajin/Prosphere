import { ICompanyEntity, IJob, IApplicationEntity } from '@/domain/interface/IEntity';
import { TIME_FRAME } from '@/shared/types/enums';
import { DateRange } from '@/shared/types/interface';
import { JobFilterByCompany } from '@/shared/types/job';
import { SubscriptionDoc } from '@/shared/types/subscription';

export interface ICompanyCreationUseCase {
    execute(job: ICompanyEntity): Promise<ICompanyEntity | null>;
}
export interface IgetAllJobByCompanyIdUseCase {
    execute(companyId: string, { filter, from , to, page, pageSize  }: JobFilterByCompany): Promise<IJob[] | null>;
}
export interface IGetApplicationByJobIdUseCase {
    execute(jobId: string, page?: number, pageSize?: number): Promise<{
        applications: IApplicationEntity[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
}
export interface IGetJobMetrixUseCase {
    execute(companyId: string, timeFrame: TIME_FRAME, dateRange: DateRange): Promise<void>
}

export interface ISubscriptionCheckUseCase {
    execute(companyId: string): Promise<SubscriptionDoc | null>;
}

export interface IUpdateFreeTrailUseCase{
    execute(companyId: string, key: string): Promise<SubscriptionDoc | null>;
}

export default interface UseCase{
    companyCreationUseCase: ICompanyCreationUseCase
    getAllJobByCompanyIdUseCase: IgetAllJobByCompanyIdUseCase
    getApplicationByJobIdUseCase: IGetApplicationByJobIdUseCase
    getJobMetrixUseCase: IGetJobMetrixUseCase
    getJobSeenUseCase: IGetJobMetrixUseCase
    subscriptionCheckUseCase: ISubscriptionCheckUseCase
    updateFreeTrailUseCase: IUpdateFreeTrailUseCase
}