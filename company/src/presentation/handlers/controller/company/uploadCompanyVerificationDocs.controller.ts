import express, { NextFunction, Request, Response } from "express";
import { z } from "zod"; // For input validation
// import { Logger } from "./logger"; // Assuming a logger implementation

// Define types for better type safety
interface VerificationDocument {
  documentType: string;
  documentUrl: string;
  uploadedAt: number;
}

interface Dependencies {
  useCases: {
    uploadCompanyVerificationDocsUseCase: any;
  };
  service: {
    s3Operation: {
      uploadImageToBucket: (buffer: Buffer, mimeType: string, key: string) => Promise<void>;
    };
  };
//   logger: Logger;
}

// Input validation schema
const uploadDocsSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    companyDocType: z.string().min(1),
    ownerDocType: z.string().min(1)
  }),
  files: z.object({
    companyDoc: z.array(z.any()).min(1),
    ownerDoc: z.array(z.any()).min(1)
  })
});

/**
 * Controller for handling company profile verification document uploads
 * 
 * @param {Dependencies} dependencies - Injected dependencies
 * @returns {Function} Express middleware function
 */
export const uploadCompanyVerificationController = (dependencies: Dependencies) => {
  const {
    useCases: { uploadCompanyVerificationDocsUseCase },
    service: { s3Operation },
    // logger
  } = dependencies;

  /**
   * Generates a unique key for S3 uploads
   * 
   * @param {string} originalName - Original filename
   * @returns {string} Unique file key
   */
  const generateUniqueKey = (originalName: string): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.]/g, '-');
    return `${timestamp}-${random}-${sanitizedName}`;
  };

  /**
   * Uploads verification documents for a company
   * 
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next middleware function
   */
  const uploadDocs = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // logger.info('Starting company verification document upload', { companyId: req.params.id });

    try {
      // Validate input
    //   const validatedInput = uploadDocsSchema.parse(req);
      const { id } = req.params;
      const { companyDocType, ownerDocType } = req.body;
      const { companyDoc, ownerDoc } = req.files;
     console.log(" files", companyDoc, ownerDoc)
      // Generate unique keys for S3
      const companyDocKey = generateUniqueKey(companyDoc[0].originalname);
      const ownerDocKey = generateUniqueKey(ownerDoc[0].originalname);

      // Upload documents to S3
      try {
       const p = await Promise.all([
          s3Operation.uploadImageToBucket(
            companyDoc[0].buffer,
            companyDoc[0].mimetype,
            companyDocKey
          ),
          s3Operation.uploadImageToBucket(
            ownerDoc[0].buffer,
            ownerDoc[0].mimetype,
            ownerDocKey
          )
        ]);
        console.log("p", p)

      } catch (error) {
        // logger.error('Failed to upload documents to S3', { error, companyId: id });
        throw new Error('Failed to upload documents to storage');
      }

      // Update company  with document information
      const verificationData = {
        id,
        companyDoc: {
          documentType: companyDocType,
          documentUrl: companyDocKey,
          uploadedAt: Date.now()
        } as VerificationDocument,
        ownerDoc: {
          documentType: ownerDocType,
          documentUrl: ownerDocKey,
          uploadedAt: Date.now()
        } as VerificationDocument
      };

      const updatedProfile = await uploadCompanyVerificationDocsUseCase(dependencies).execute(verificationData);

    //   logger.info('Successfully uploaded verification documents', { companyId: id });

      res.status(200).json({
        success: true,
        data: updatedProfile,
        message: 'Company verification documents uploaded successfully'
      });

    } catch (error) {
    //   logger.error('Error in uploadDocs controller', { error });

      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Invalid input data',
          errors: error.errors
        });
        return;
      }

      next(error);
    }
  };

  return uploadDocs;
};