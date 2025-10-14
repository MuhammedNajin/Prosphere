import { Repositories, Services } from "@/di/symbols";
import { ICompany } from "@/domain/interface/ICompany";
import { ICompanyRepository } from "@/infrastructure/interface/repositories/ICompanyRepository";
import { ForbiddenError, getEnvs, NotFoundError } from "@muhammednajinnprosphere/common";
import { inject, injectable } from "inversify";
import { CompanyStatus, ErrorCode } from "../../../shared/constance";
import { ITokenService } from "@/infrastructure/interface/services/ITokenService";

const { COMPANY_TOKEN_SECRET, COMPANY_TOKEN_EXPIRY } = getEnvs(
  "COMPANY_TOKEN_SECRET",
  "COMPANY_TOKEN_EXPIRY"
);

export interface CompanyAccessTokenPayload {
  companyId: string;
  companyName: string;
  verified: boolean;
  status: string;
  owerId: string;
}

@injectable()
export class GenerateCompanyAccessTokenUseCase {
  constructor(
    @inject(Repositories.CompanyRepository)
    private companyRepository: ICompanyRepository,
    @inject(Services.TokenService) private tokenService: ITokenService
  ) {}
  async execute(
    id: string
  ): Promise<{ company: ICompany; accessToken: string }> {
    const company = await this.companyRepository.findById(id);

    if (!company) {
      throw new NotFoundError(
        `Company with ID '${id}' not found.`,
        ErrorCode.COMPANY_NOT_FOUND
      );
    }

     if (company.status !== CompanyStatus.VERIFIED) {
      throw new ForbiddenError(
        "Access denied. Company account is not verified. Please complete the verification process to proceed."
      );
    }

    const payload = {
      companyId: company.id,
      companyName: company.name,
      verified: company.verified,
      status: company.status,
      owerId: company.owner,
    };

    const accessToken =
      this.tokenService.generateJwtToken<CompanyAccessTokenPayload>(
        payload,
        COMPANY_TOKEN_SECRET,
        COMPANY_TOKEN_EXPIRY
      );

    return {
      company,
      accessToken,
    };
  }
}
