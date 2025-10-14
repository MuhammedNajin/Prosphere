import { Repositories, Services } from "@/di/symbols";
import { ICompanyRepository } from "@/infrastructure/interface/repositories/ICompanyRepository";
import { ICloudStorageService } from "@/infrastructure/interface/services/ICloudStorageService";
import { ErrorCode } from "@/shared/constance";
import { NotFoundError, BadRequestError } from "@muhammednajinnprosphere/common";
import { inject, injectable } from "inversify";

interface UploadCompanyLogoUseCaseParams {
  id: string;
  logoFile: Express.Multer.File;
}

@injectable()
export class UploadCompanyLogoUseCase {
  constructor(
    @inject(Repositories.CompanyRepository) private companyRepository: ICompanyRepository,
    @inject(Services.CloudStorageService) private cloudStorageService: ICloudStorageService
  ) {}

  private generateUniqueKey(originalName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.]/g, "-");
    return `company-logo-${timestamp}-${random}-${sanitizedName}`;
  }

  private validateFile(file: Express.Multer.File): void {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestError(
        `Invalid logo file type. Allowed: JPEG, PNG, WebP`,
        ErrorCode.INVALID_FILE_TYPE
      );
    }

    if (file.size > maxFileSize) {
      throw new BadRequestError(
        `Logo file size too large. Maximum allowed: 5MB`,
        ErrorCode.FILE_SIZE_EXCEEDED
      );
    }
  }

  private async uploadFileToS3(file: Express.Multer.File): Promise<string> {
    this.validateFile(file);

    const uniqueKey = this.generateUniqueKey(file.originalname);
    await this.cloudStorageService.upload(file.buffer, file.mimetype, uniqueKey);

    return uniqueKey;
  }

  async execute({ id, logoFile }: UploadCompanyLogoUseCaseParams): Promise<string> {
    const company = await this.companyRepository.findById(id);
    if (!company) {
      throw new NotFoundError(
        `Company with ID '${id}' not found.`,
        ErrorCode.COMPANY_NOT_FOUND
      );
    }

    if (company.logo) {
      await this.cloudStorageService.delete(company.logo);
    }

    const logoKey = await this.uploadFileToS3(logoFile);

    await this.companyRepository.update(id, { logo: logoKey });

    return logoKey;
  }
}
