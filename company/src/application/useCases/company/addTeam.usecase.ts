import { injectable, inject } from "inversify";
import { BadRequestError, NotFoundError } from "@muhammednajinnprosphere/common";
import { TeamRole } from "@/shared/constance";
import { ICompanyRepository } from "@infrastructure/interface/repositories/ICompanyRepository";
import { ErrorCode } from "../../../shared/constance";
import { IUserRepository } from "@/infrastructure/interface/repositories/IUserRepository";
import { ICompany } from "@/domain/interface/ICompany";
import { Repositories } from "@/di/symbols";


@injectable()
export class AddEmployeeUseCase {
  constructor(
    @inject(Repositories.CompanyRepository) private companyRepository: ICompanyRepository,
    @inject(Repositories.UserRepository) private userRepository: IUserRepository
  ) {
    if (!companyRepository || !userRepository) {
      throw new Error("AddEmployeeUseCase initialization error: required dependencies are missing.");
    }
  }

  async execute(companyId: string, userId: string): Promise<ICompany | null> {
  
    const company = await this.companyRepository.findById(companyId);
    if (!company) {
      throw new NotFoundError(
        `Company with ID '${companyId}' not found.`,
        ErrorCode.COMPANY_NOT_FOUND,
      );
    }
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(`User with ID '${userId}' not found.`);
    }
    if (company.team?.some((member) => member.userId.toString() === userId)) {
      throw new BadRequestError("Employee already exists in the company team.");
    }
    return await this.companyRepository.addEmployee(companyId, userId, TeamRole.MEMBER);
  }
}


