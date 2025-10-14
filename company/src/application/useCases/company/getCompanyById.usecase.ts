import { Repositories } from "@/di/symbols";
import { ICompany } from "@/domain/interface/ICompany";
import { ICompanyRepository } from "@/infrastructure/interface/repositories/ICompanyRepository";
import { NotFoundError } from "@muhammednajinnprosphere/common";
import { inject, injectable } from "inversify";
import { ErrorCode } from "../../../shared/constance";

@injectable()
export class GetCompanyByIdUseCase {
  constructor(
    @inject(Repositories.CompanyRepository) private companyRepository: ICompanyRepository,
  ) {}


  async execute(id: string): Promise<ICompany> {
   
    const company = await this.companyRepository.findById(id);
    
    if (!company) {
      throw new NotFoundError(
        `Company with ID '${id}' not found.`,
         ErrorCode.COMPANY_NOT_FOUND,
      );
    }
    
    return company;
  }
}