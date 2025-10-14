import { Repositories } from "@/di/symbols";
import { ICompany, ITeamMember } from "@/domain/interface/ICompany";
import { inject, injectable } from "inversify";
import { ErrorCode } from "../../../shared/constance";
import { ICompanyRepository } from "@/infrastructure/interface/repositories/ICompanyRepository";
import { NotFoundError } from "@muhammednajinnprosphere/common";

@injectable()
export class GetEmployeesUseCase {
  constructor(
    @inject(Repositories.CompanyRepository) private companyRepository: ICompanyRepository
  ) {
    if (!companyRepository) {
      throw new Error("GetEmployeesUseCase initialization error: 'companyRepository' is required.");
    }
  }

  async execute(companyId: string): Promise<{id: string; team?: ITeamMember[] } | null> {
  
    const company = await this.companyRepository.findEmployees(companyId);
    
    if (!company) {
      throw new NotFoundError(
        `Company with ID '${companyId}' not found.`,
        ErrorCode.COMPANY_NOT_FOUND,
      );
    }
    return company;
  }
}