import {
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
    PutObjectCommandOutput,
    DeleteObjectCommandOutput
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';
import { ICloudStorageService } from '../interface/service/ICloudStorageService';

dotenv.config();

/**
 * @class CloudStorageService
 * @implements {ICloudStorageService}
 * @description Provides methods for interacting with an AWS S3 bucket for file storage operations.
 */

export class CloudStorageService implements ICloudStorageService {
    private readonly s3: S3Client;
    private readonly bucketName: string;

    constructor() {
        const secretKey = process.env.SECRET_KEY as string;
        const accessKey = process.env.ACCESS_KEY as string;
        const bucketRegion = process.env.BUCKET_REGION as string;
        this.bucketName = process.env.BUCKET_NAME as string;

        // Basic validation for environment variables
        if (!secretKey || !accessKey || !bucketRegion || !this.bucketName) {
            throw new Error("Missing required S3 environment variables.");
        }

        this.s3 = new S3Client({
            credentials: {
                accessKeyId: accessKey,
                secretAccessKey: secretKey,
            },
            region: bucketRegion
        });
    }

    /**
     * @method upload
     * @description Implements the upload functionality for S3.
     */
    async upload(fileBuffer: Buffer, fileType: string, key: string): Promise<PutObjectCommandOutput> {
        const uploadParams = {
            Bucket: this.bucketName,
            Body: fileBuffer,
            Key: key,
            ContentType: fileType,
        };
        return this.s3.send(new PutObjectCommand(uploadParams));
    }

    /**
     * @method getSignedUrl
     * @description Implements the signed URL generation for S3. The URL is valid for one hour.
     */
    async getSignedUrl(key: string): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: key
        });
        // The URL will be valid for 1 hour (3600 seconds) by default.
        return await getSignedUrl(this.s3, command, { expiresIn: 3600 });
    }

    /**
     * @method delete
     * @description Implements the delete functionality for S3.
     */
    async delete(key: string): Promise<DeleteObjectCommandOutput> {
        const deleteParams = {
            Bucket: this.bucketName,
            Key: key,
        };
        return this.s3.send(new DeleteObjectCommand(deleteParams));
    }

    /**
     * @method download
     * @description Implements the file download functionality for S3.
     */
    async download(key: string): Promise<string | undefined> {
        const downloadParams = {
            Bucket: this.bucketName,
            Key: key,
        };
        const { Body } = await this.s3.send(new GetObjectCommand(downloadParams));
        return Body?.transformToString();
    }
}
