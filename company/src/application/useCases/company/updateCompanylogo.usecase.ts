import { Repositories, Services } from "@/di/symbols";

import { ICompanyRepository } from "@/infrastructure/interface/repositories/ICompanyRepository";
import { ICloudStorageService } from "@/infrastructure/interface/services/ICloudStorageService";
import { ErrorCode } from "@/shared/constance";
import { NotFoundError } from "@muhammednajinnprosphere/common";
import { inject, injectable } from "inversify";

interface UpdateCompanyLogoUseCaseParams {
  id: string;
  file: Express.Multer.File;
}

@injectable()
export class UpdateCompanyLogoUseCase {
  constructor(
    @inject(Repositories.CompanyRepository) private companyRepository: ICompanyRepository,
    @inject(Services.CloudStorageService) private cloudStorageService: ICloudStorageService
  ) {}

  async execute({ id, file }: UpdateCompanyLogoUseCaseParams): Promise<{ url: string; bucketKey: string }> {
   
    const bucketKey = `${file.originalname}${Math.random()}`;
    const data = await this.cloudStorageService.upload(file.buffer, file.mimetype, bucketKey);
    const company = await this.companyRepository.update(id, { logo: bucketKey });
    if (!company) {
      throw new NotFoundError(
        `Company with ID '${id}' not found.`,
        ErrorCode.COMPANY_NOT_FOUND
      );
    }
    const url = await this.cloudStorageService.getSignedUrl(bucketKey);
    return { url, bucketKey };
  }
}