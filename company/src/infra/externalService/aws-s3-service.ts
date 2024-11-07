import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv'

dotenv.config();

class S3Operations {
  private s3: S3Client;
  private bucketName: string;

  constructor() {
    const secretKey = process.env.SECRET_KEY as string;
    const accessKey = process.env.ACCESS_KEY as string;
    const bucketRegion = process.env.BUCKET_REGION as string;
    this.bucketName = process.env.BUCKET_NAME as string;
    console.log( "secret",secretKey, accessKey)
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey
      },
      region: bucketRegion
    });
  }

  uploadImageToBucket = async (fileBufferCode: Buffer, fileType: string, key: string) => {
    
    const uploadParams = {
      Bucket: this.bucketName,
      Body: fileBufferCode,
      Key: key,
      ContentType: fileType,
      
    };

    const data = await this.s3.send(new PutObjectCommand(uploadParams));
    return data;
  }

  getImageUrlFromBucket = async (key: string) => {
    let imageUrl = await getSignedUrl(
      this.s3,
      new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key
      }),
      { expiresIn: 60 }
    );
    return imageUrl;
  }

  deleteImageFromBucket = async (key: string) => {
    const deleteParams = {
      Bucket: this.bucketName,
      Key: key,
    };

    const data = await this.s3.send(new DeleteObjectCommand(deleteParams));
    return data;
  }

  downloadFileFromBucket = async (key: string) => {
    const downloadParams = {
      Bucket: this.bucketName,
      Key: key,
    };
    const image = await this.s3.send(new GetObjectCommand(downloadParams));
    console.log(image.Body?.transformToString());
    return image.Body?.transformToString();
  }
}

export default new S3Operations();