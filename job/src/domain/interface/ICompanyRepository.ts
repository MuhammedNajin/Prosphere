import { DateRange } from '@/shared/types/interface';
import { ICompanyEntity, IJob, IApplicationEntity } from './IEntity';
import { JobFilterByCompany } from '@/shared/types/job';

export interface ICompanyRepository {
   create(job: ICompanyEntity): Promise<ICompanyEntity | null>
   getAll(companyId: string, { filter, from , to  }: JobFilterByCompany): Promise<IJob[] | null>
   getApplicationByJobId(jobId: string): Promise<IApplicationEntity[] | null> 
   getJobMetrix(companyId: string, timeFrame: string, dateRange: DateRange): Promise<void>
   getJobVeiws(companyId: string, timeFrame: string, dateRange: DateRange): Promise<void>
}  