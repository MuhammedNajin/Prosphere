import { Repositories, Services } from "@/di/symbols"; 
import { DocumentType, ICompany, ICompanyVerificationDoc, IOwnerVerificationDoc } from "@/domain/interface/ICompany";
import { ICompanyRepository } from "@/infrastructure/interface/repositories/ICompanyRepository";
import { ICloudStorageService } from "@/infrastructure/interface/services/ICloudStorageService";
import { ErrorCode } from "@/shared/constance";
import { NotFoundError, BadRequestError } from "@muhammednajinnprosphere/common";
import { inject, injectable } from "inversify";

interface UploadCompanyVerificationDocsUseCaseParams {
  id: string;
  companyDocType: DocumentType;
  ownerDocType: DocumentType;
  companyDocFile: Express.Multer.File;
  ownerDocFile: Express.Multer.File;
}

interface UploadCompanyVerificationDocsUseCaseResult {
  companyDoc: ICompanyVerificationDoc;
  ownerDoc: IOwnerVerificationDoc;
}

@injectable()
export class UploadCompanyVerificationDocsUseCase {
  constructor(
    @inject(Repositories.CompanyRepository) private companyRepository: ICompanyRepository,
    @inject(Services.CloudStorageService) private cloudStorageService: ICloudStorageService
  ) {}

  /**
   * Generate unique key for file storage
   */
  private generateUniqueKey(originalName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.]/g, "-");
    return `verification-docs-${timestamp}-${random}-${sanitizedName}`;
  }

  /**
   * Validate file types and sizes
   */
  private validateFile(file: Express.Multer.File, docType: string): void {
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ];

    const maxFileSize = 10 * 1024 * 1024; // 10MB

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestError(
        `Invalid file type for ${docType}. Allowed types: PDF, JPEG, PNG, WebP`,
        ErrorCode.INVALID_FILE_TYPE
      );
    }

    if (file.size > maxFileSize) {
      throw new BadRequestError(
        `File size too large for ${docType}. Maximum allowed: 10MB`,
        ErrorCode.FILE_SIZE_EXCEEDED
      );
    }
  }

  /**
   * Upload file to S3 and return the key
   */
  private async uploadFileToS3(file: Express.Multer.File, docType: string): Promise<string> {
    try {
      console.log("uploadFiletoS3 file", file);
      this.validateFile(file, docType);
      
      const uniqueKey = this.generateUniqueKey(file.originalname);
      console.log(`Uploading ${docType} with key: ${uniqueKey}`);
      await this.cloudStorageService.upload(
        file.buffer,
        file.mimetype,
        uniqueKey
      );

      return uniqueKey;
    } catch (error) {
      console.log(`Error uploading ${docType}:`, error);
      throw new BadRequestError(
        `Failed to upload ${docType}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ErrorCode.FILE_UPLOAD_FAILED
      );
    }
  }

  /**
   * Delete old verification documents from S3 if they exist
   */
  private async deleteOldDocuments(company: ICompany): Promise<void> {
      
      console.log("dddddddddddddddddd", company)
      if (company?.companyVerificationDoc?.documentUrl) {
        await this.cloudStorageService.delete(company.companyVerificationDoc.documentUrl);
      }
      
      if (company?.ownerVerificationDoc?.documentUrl) {
        await this.cloudStorageService.delete(company.ownerVerificationDoc.documentUrl);
      }
  }

  async execute({
    id,
    companyDocType,
    ownerDocType,
    companyDocFile,
    ownerDocFile
  }: UploadCompanyVerificationDocsUseCaseParams): Promise<UploadCompanyVerificationDocsUseCaseResult> {
      
      console.log('document', companyDocFile, ownerDocFile);
    const company = await this.companyRepository.findById(id);
    if (!company) {
      throw new NotFoundError(
        `Company with ID '${id}' not found.`,
        ErrorCode.COMPANY_NOT_FOUND
      );
    }

      await this.deleteOldDocuments(company);

      const [companyDocKey, ownerDocKey] = await Promise.all([
        this.uploadFileToS3(companyDocFile, 'company document'),
        this.uploadFileToS3(ownerDocFile, 'owner document')
      ]);

      const companyDoc: ICompanyVerificationDoc = {
        documentType: companyDocType,
        documentUrl: companyDocKey,
        uploadedAt: new Date(),
      };

      const ownerDoc: IOwnerVerificationDoc = {
        documentType: ownerDocType,
        documentUrl: ownerDocKey,
        uploadedAt: new Date(),
      };

      const updatedCompany = await this.companyRepository.updateDocs(id, ownerDoc, companyDoc);

      console.log('Updated company:', updatedCompany);

      return {
        companyDoc,
        ownerDoc,
      };
  }
}