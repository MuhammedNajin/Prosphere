import { Repositories } from "@/di/symbols";
import { ICompany } from "@/domain/interface/ICompany";
import { ICompanyRepository } from "@/infrastructure/interface/repositories/ICompanyRepository";
import { BadRequestError, NotFoundError } from "@muhammednajinnprosphere/common";
import { inject, injectable } from "inversify";
import { ErrorCode } from "../../../shared/constance";

@injectable()
export class GetCompanyByNameUseCase {
  constructor(
    @inject(Repositories.CompanyRepository) private companyRepository: ICompanyRepository
  ) {}

  async execute(name: string): Promise<ICompany> {
   
    const company = await this.companyRepository.findByName(name);
    if (!company) {
      throw new NotFoundError(
        `Company with name '${name}' not found.`,
         ErrorCode.COMPANY_NOT_FOUND,
      );
    }
    return company;
  }
}