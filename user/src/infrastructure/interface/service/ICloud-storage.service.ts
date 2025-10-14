import { DeleteObjectCommandOutput, PutObjectCommandOutput } from "@aws-sdk/client-s3";

/**
 * @interface ICloudStorageService
 * @description Defines the contract for a cloud storage service, specifying the methods for file operations.
 */
export interface ICloudStorageService {
    /**
     * @method upload
     * @description Uploads a file to the storage bucket.
     * @param {Buffer} fileBuffer - The file content as a buffer.
     * @param {string} fileType - The MIME type of the file (e.g., 'image/jpeg').
     * @param {string} key - The unique key (path/filename) for the file in the bucket.
     * @returns {Promise<PutObjectCommandOutput>} A promise that resolves with the response from the upload operation.
     */
    upload(fileBuffer: Buffer, fileType: string, key: string): Promise<PutObjectCommandOutput>;

    /**
     * @method getSignedUrl
     * @description Generates a temporary, pre-signed URL to access a file.
     * @param {string} key - The key of the file in the bucket.
     * @returns {Promise<string>} A promise that resolves with the pre-signed URL string.
     */
    getSignedUrl(key: string): Promise<string>;

    /**
     * @method delete
     * @description Deletes a file from the storage bucket.
     * @param {string} key - The key of the file to delete.
     * @returns {Promise<DeleteObjectCommandOutput>} A promise that resolves when the file is successfully deleted.
     */
    delete(key: string): Promise<DeleteObjectCommandOutput>;

    /**
     * @method download
     * @description Downloads a file from the bucket and returns its content as a string.
     * @param {string} key - The key of the file to download.
     * @returns {Promise<string | undefined>} A promise that resolves with the file content as a string, or undefined if the body is empty.
     */
    download(key: string): Promise<string | undefined>;
}