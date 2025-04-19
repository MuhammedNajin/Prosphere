import {
  IJobPostUseCase,
  IgetJobsUseCase,
} from "../../interface/jobUsecase_interface";
import { IJobRepository } from "@domain/interface/IJobRepository";
import { JobListingQueryParams } from "@/shared/types/interface";
export class GetJobsUseCase implements IgetJobsUseCase {
  constructor(private jobRepository: IJobRepository) {}

  async execute({
    page,
    pageSize,
    filter,
    search,
    location,
  }: JobListingQueryParams): Promise<{
    jobs: any[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    return await this.jobRepository.getAll({
      page,
      pageSize,
      filter,
      search,
      location,
    });
   

   
  }
}
