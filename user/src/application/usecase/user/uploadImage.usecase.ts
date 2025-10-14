import { IUserRepository } from "@/infrastructure/interface/repository/IUserRepository";
import { BadRequestError, NotFoundError } from "@muhammednajinnprosphere/common";
import { Repositories, Services } from "@/di/symbols";
import { inject, injectable } from "inversify";
import { ICloudStorageService } from "@/infrastructure/interface/service/ICloud-storage.service";
import { IImageService } from "@/infrastructure/interface/service/IImage.service";

// Image processing options interface
export interface ImageProcessingOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

// Request/Response types
export interface UploadProfilePhotoRequest {
  file: Express.Multer.File;
  userId: string;
  photoType: ProfilePhotoType;
  imageOptions?: ImageProcessingOptions;
}

export interface UploadProfilePhotoResponse {
  bucketKey: string;
  imageUrl: string;
  photoType: ProfilePhotoType;
  uploadedAt: Date;
}

export enum ProfilePhotoType {
  PROFILE_IMAGE = 'profileImageKey',
  COVER_IMAGE = 'coverImageKey'
}

// Default options for each photo type
const DEFAULT_IMAGE_OPTIONS: Record<ProfilePhotoType, ImageProcessingOptions> = {
  [ProfilePhotoType.PROFILE_IMAGE]: {
    width: 400,
    height: 400,
    quality: 80,
    format: 'jpeg',
    fit: 'cover'
  },
  [ProfilePhotoType.COVER_IMAGE]: {
    width: 1200,
    height: 300,
    quality: 85,
    format: 'jpeg',
    fit: 'cover'
  }
};

@injectable()
export class UploadProfilePhotoUseCase {
  constructor(
    @inject(Repositories.UserRepository) 
    private readonly userRepository: IUserRepository,
    
    @inject(Services.CloudStorageService) 
    private readonly cloudStorageService: ICloudStorageService,
    
    @inject(Services.ImageService) 
    private readonly imageService: IImageService
  ) {}

  async execute(request: UploadProfilePhotoRequest): Promise<UploadProfilePhotoResponse> {
    const { file, userId, photoType, imageOptions } = request;

    try {
      // Validate input
      this.validateRequest(request);

      // Check if user exists
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Get old image key for cleanup
      const oldBucketKey = this.getOldImageKey(user, photoType);

      // Use provided options or defaults for photo type
      const processingOptions = imageOptions || DEFAULT_IMAGE_OPTIONS[photoType];
      
      // Process and upload image
      const { bucketKey, imageUrl } = await this.processAndUploadImage(file, processingOptions);

      // Update user record
      const updateData = { [photoType]: bucketKey };
      await this.userRepository.update(userId, updateData);

      // Clean up old image if it exists
      if (oldBucketKey) {
        await this.cleanupOldImage(oldBucketKey);
      }

      return {
        bucketKey,
        imageUrl,
        photoType,
        uploadedAt: new Date()
      };

    } catch (error) {
      console.error("Error uploading profile photo:", error);
      throw error;
    }
  }

  private validateRequest(request: UploadProfilePhotoRequest): void {
    const { file, userId, photoType } = request;

    if (!file) {
      throw new BadRequestError('File is required');
    }

    if (!userId) {
      throw new BadRequestError('User ID is required');
    }

    if (!Object.values(ProfilePhotoType).includes(photoType)) {
      throw new BadRequestError('Invalid photo type');
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestError('Invalid file type. Only JPEG, PNG, and WebP are allowed');
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestError('File size exceeds 10MB limit');
    }
  }

  private async processAndUploadImage(
    file: Express.Multer.File,
    options: ImageProcessingOptions
  ): Promise<{
    bucketKey: string;
    imageUrl: string;
  }> {
    
    // Resize image
    const resizedImageBuffer = await this.imageService.resizeImage(
      file.buffer,
      options
    );

    if (!resizedImageBuffer) {
      throw new BadRequestError('Failed to process image');
    }

    // Generate unique bucket key
    const bucketKey = this.generateBucketKey(file.originalname);
    const mimeType = `image/${options.format || 'jpeg'}`;

    try {
      // Upload to storage
      const uploadResult = await this.cloudStorageService.upload(
        resizedImageBuffer,
        mimeType,
        bucketKey
      );

      // Get public URL
      const imageUrl = await this.cloudStorageService.getSignedUrl(bucketKey);

      return { bucketKey, imageUrl };
    } catch (uploadError) {
      console.error('Failed to upload image to cloud storage:', uploadError);
      throw new BadRequestError('Failed to upload image');
    }
  }

  private generateBucketKey(originalName: string): string {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const cleanName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    return `profile-photos.${timestamp}-${randomSuffix}-${cleanName}`;
  }

  private getOldImageKey(user: any, photoType: ProfilePhotoType): string | null {
    return user[photoType] || null;
  }

  private async cleanupOldImage(bucketKey: string): Promise<void> {
    try {
      await this.cloudStorageService.delete(bucketKey);
      console.log(`Successfully deleted old image: ${bucketKey}`);
    } catch (error) {
      console.warn(`Failed to delete old image ${bucketKey}:`, error);
      // Don't throw error for cleanup failures - this is a background operation
    }
  }
}

