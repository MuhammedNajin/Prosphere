import { CompanyCreationRepository } from "./companyCreation.repository";
import { IApplicationEntity, ICompanyEntity } from "@domain/interface/IEntity";
import { JobDoc } from "@infra/database/mongo/schema/job.schema";
import { GetJobByCompanyIdRepository } from "./getJobsByCompanyId.repository";
import { GetApplicationByJobIdRepository } from "./getApplicationByJobId.repository";
import { TIME_FRAME } from "@/shared/types/enums";
import { GetJobMetrixRepository } from "./getJobMetrix.repository";
import { DateRange } from "@/shared/types/interface";
import { GetJobViewsRepository } from "./getJobSeenCount.repository";
import { JobFilterByCompany } from "@/shared/types/job";

export class CompanyRepository {
  private CompanyCreationRepo = CompanyCreationRepository;
  private GetAllJobByCompanyRepo = GetJobByCompanyIdRepository;
  private GetJobsByJobIdRepo = GetApplicationByJobIdRepository;
  private GetJobMetrixRepo = GetJobMetrixRepository;
  private GetJobViewsRepo = GetJobViewsRepository;
  public async create(company: ICompanyEntity): Promise<ICompanyEntity | null> {
    return await this.CompanyCreationRepo.create(company);
  }

  public async getAll(
    companyId: string,
    { filter, from, to, page, pageSize }: JobFilterByCompany
  ): Promise<JobDoc[] | null> {
    return await this.GetAllJobByCompanyRepo.getAll(companyId, {
      from,
      to,
      filter,
      page,
      pageSize,
    });
  }

  public async getApplicationByJobId(
    jobId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<{
    applications: IApplicationEntity[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * pageSize;

    console.log("debug from company repo", jobId, page, pageSize)

    // Get total count of applications
    const total = await this.GetJobsByJobIdRepo.count(jobId);

    // Get paginated applications
    const applications = await this.GetJobsByJobIdRepo.getAll(
      jobId,
      skip,
      pageSize
    );

    return {
      applications,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  public async getJobMetrix(
    companyId: string,
    timeFrame: TIME_FRAME,
    dateRange: DateRange
  ): Promise<void> {
    return await this.GetJobMetrixRepo.getMetrix(
      companyId,
      timeFrame,
      dateRange
    );
  }

  public async getJobVeiws(
    companyId: string,
    timeFrame: TIME_FRAME,
    dateRange: DateRange
  ): Promise<void> {
    return await this.GetJobViewsRepo.getMetrics(
      companyId,
      timeFrame,
      dateRange
    );
  }
}
