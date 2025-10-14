import { Repositories, Services } from "@/di/symbols";
import { IUserRepository } from "@/infrastructure/interface/repository/IUserRepository";
import { ICloudStorageService } from "@/infrastructure/interface/service/ICloud-storage.service";
import { BadRequestError } from "@muhammednajinnprosphere/common";
import { inject, injectable } from "inversify";

export interface UploadResumeRequest {
  file: Express.Multer.File;
  id: string;
}

export interface UploadResumeResponse {
  bucketKey: string;
  resumeUrl: string;
  fileName: string;
  fileSize: number;
  uploadedAt: Date;
}

@injectable()
export class UploadResumeUseCase {
  constructor(
    @inject(Repositories.UserRepository) 
    private readonly userRepository: IUserRepository,
    
    @inject(Services.CloudStorageService) 
    private readonly cloudStorageService: ICloudStorageService
  ) {}

  async execute(request: UploadResumeRequest): Promise<UploadResumeResponse> {
    const { file, id } = request;

    try {
      // Validate input
      this.validateRequest(request);

      // Check if user exists
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new BadRequestError('User not found');
      }

      // Generate unique bucket key
      const bucketKey = this.generateBucketKey(file.originalname);
      
      console.log("Uploading resume:", { 
        fileName: file.originalname, 
        bucketKey,
        userId: id,
        fileSize: file.size 
      });

      // Upload file to cloud storage
      await this.cloudStorageService.upload(
        file.buffer,
        file.mimetype,
        bucketKey
      );

      console.log("Resume uploaded successfully:", bucketKey);
      
      // Add resume reference to user record
      await this.userRepository.addResume(id, bucketKey);
      
      // Get signed URL for the uploaded file
      const resumeUrl = await this.cloudStorageService.getSignedUrl(bucketKey);

      return {
        bucketKey,
        resumeUrl,
        fileName: file.originalname,
        fileSize: file.size,
        uploadedAt: new Date()
      };

    } catch (error) {
      console.error("Error uploading resume:", error);
      
      // Clean up if upload succeeded but database operation failed
      // This is a best-effort cleanup
      try {
        await this.cloudStorageService.delete(this.generateBucketKey(file.originalname));
      } catch (cleanupError) {
        console.warn("Failed to cleanup uploaded file during error handling:", cleanupError);
      }
      
      throw error;
    }
  }

  private validateRequest(request: UploadResumeRequest): void {
    const { file, id } = request;

    if (!file) {
      throw new BadRequestError('Resume file is required');
    }

    if (!id) {
      throw new BadRequestError('User ID is required');
    }

    // Validate file type for resumes
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestError('Invalid file type. Only PDF and Word documents are allowed');
    }

    // Validate file size (5MB limit for resumes)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestError('Resume file size exceeds 5MB limit');
    }

    // Validate filename
    if (!file.originalname || file.originalname.trim().length === 0) {
      throw new BadRequestError('Valid filename is required');
    }
  }

  private generateBucketKey(originalName: string): string {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 15);
    const cleanName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    return `resumes.${timestamp}-${randomSuffix}-${cleanName}`;
  }
}