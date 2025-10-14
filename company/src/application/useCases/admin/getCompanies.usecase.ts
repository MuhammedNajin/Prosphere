import { Repositories } from "@/di/symbols";
import { ICompany } from "@/domain/interface/ICompany";
import { ICompanyRepository } from "@/infrastructure/interface/repositories/ICompanyRepository";
import { inject, injectable } from "inversify";

export interface GetCompaniesParams {
  page: number;
  limit: number;
  skip: number;
  status?: string;
  search?: string;
}

export interface PaginatedCompaniesResult {
  companies: ICompany[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

@injectable()
export class GetCompaniesUseCase {
  constructor(
    @inject(Repositories.CompanyRepository) private companyRepository: ICompanyRepository
  ) {}

  async execute(params: GetCompaniesParams): Promise<PaginatedCompaniesResult> {
    const { companies, totalCount } = await this.companyRepository.findAll(params);
    
    const totalPages = Math.ceil(totalCount / params.limit);
    
    return {
      companies,
      pagination: {
        currentPage: params.page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: params.limit,
        hasNextPage: params.page < totalPages,
        hasPreviousPage: params.page > 1
      }
    };
  }
}