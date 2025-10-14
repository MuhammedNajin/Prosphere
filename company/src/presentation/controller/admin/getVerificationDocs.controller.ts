import { ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";
import { NextFunction, Request, Response } from "express";

export const getVerificatonDocsController = (dependencies: any) => {
  console.log("Initializing getFileController...");

  const {
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
        return res
               .status(StatusCode.NOT_FOUND)
               .json(ResponseUtil.error
                (
                StatusCode.NOT_FOUND, 
                `File with key "${key}" not found in the bucket.`)
                );
      }

      res.status(StatusCode.OK).json({
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
