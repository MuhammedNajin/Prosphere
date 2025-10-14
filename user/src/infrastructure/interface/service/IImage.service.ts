// Enhanced interfaces with options
export interface ImageProcessingOptions {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  }
  
  export interface UploadProfilePhotoRequest {
    file: Express.Multer.File;
    userId: string;
    photoType: ProfilePhotoType;
    imageOptions?: ImageProcessingOptions; // New optional field
  }
  
  // Enhanced ProfilePhotoType with default options
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
  
  // Updated IImageService interface
  export interface IImageService {
    resizeImage(
      imageBuffer: Buffer, 
      options?: ImageProcessingOptions
    ): Promise<Buffer | undefined>;
  }