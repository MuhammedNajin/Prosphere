import { Repositories } from "@/di/symbols";
import { ICompany } from "@/domain/interface/ICompany";
import { ICompanyRepository } from "@/infrastructure/interface/repositories/ICompanyRepository";
import { CompanyStatus } from "@/shared/constance";
import { BadRequestError, NotFoundError } from "@muhammednajinnprosphere/common";
import { inject, injectable } from "inversify";


@injectable()
export class ChangeCompanyStatusUseCase {
  constructor(
    @inject(Repositories.CompanyRepository) private companyRepository: ICompanyRepository
  ) {}

  async execute(id: string, status: CompanyStatus): Promise<ICompany | null> {
    
    const company = await this.companyRepository.findById(id);
    if (!company) {
      throw new NotFoundError(`Company with ID '${id}' not found.`);
    }
    if (company.status === CompanyStatus.VERIFIED) {
      throw new BadRequestError("Company status is already verified.");
    }
    if (status === CompanyStatus.PENDING) {
      throw new BadRequestError("Cannot change status to pending.");
    }
    return await this.companyRepository.updateStatus(id, status);
  }
}
