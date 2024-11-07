import express, { NextFunction, Request, Response } from "express";

export const getFileController = (dependencies: any) => {
  console.log("Initializing getFileController...");

  const {
    useCases: { getMyCompanyUseCase },
    service: { s3Operation }
  } = dependencies;

  const getFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Request params:", req.params);
      const { key } = req.params;

      // Fetch the signed URL from S3
      const url = await s3Operation.getImageUrlFromBucket(key);
      console.log("url", url)
      // Check if the URL was successfully retrieved
      if (!url) {
        return res.status(404).json({
          success: false,
          message: `File with key "${key}" not found in the bucket.`,
        });
      }

      res.status(200).json({
        success: true,
        url,
        message: "File retrieved successfully.",
      });
      
    } catch (error) {
      console.error("Error fetching file:", error);
      next(error);
    }
  };

  return getFile;
};
