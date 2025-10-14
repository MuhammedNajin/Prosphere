import { injectable } from 'inversify';
import sharp from 'sharp';

@injectable()
export class ImageService {
  /**
   * Resize image buffer to 160x160 with contain fit
   * @param imageBuffer - Input image buffer
   * @returns Resized image buffer or undefined if error occurs
   */
  async resizeImage(imageBuffer: Buffer): Promise<Buffer | undefined> {
    try {
      return await sharp(imageBuffer)
        .resize({ width: 160, height: 160, fit: 'contain' })
        .toBuffer();
    } catch (error) {
      console.log('Image resize error:', error);
      return undefined;
    }
  }
}
