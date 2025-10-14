import { Repositories } from "@/di/symbols";
import { ICompany } from "@/domain/interface/ICompany";
import { ICompanyRepository } from "@/infrastructure/interface/repositories/ICompanyRepository";
import { ErrorCode } from "@/shared/constance";
import { NotFoundError } from "@muhammednajinnprosphere/common";
import { inject, injectable } from "inversify";


@injectable()
export class GetMyCompanyUseCase {
  constructor(
    @inject(Repositories.CompanyRepository) private companyRepository: ICompanyRepository
  ) {
    if (!companyRepository) {
      throw new Error("GetMyCompanyUseCase initialization error: 'companyRepository' is required.");
    }
  }

  async execute(ownerId: string): Promise<ICompany[]> {
   
    const companies = await this.companyRepository.findByOwner(ownerId);
    if (!companies.length) {
      throw new NotFoundError(
        "No companies found for this owner.",
        ErrorCode.NO_COMPANIES_FOUND
      );
    }
    return companies;
  }
}
