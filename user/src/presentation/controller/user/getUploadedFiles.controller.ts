import { ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";
import express, { NextFunction, Request, Response } from "express";

export const getFilesController = (dependencies: any) => {
    const {
        service: { s3Operation }
    } = dependencies;
     console.log("  service: { s3Operation }, ", dependencies);
     
    const getFiles = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { keys } = req.body;
            console.log("keys", keys);
            if (!Array.isArray(keys)) {
                return res.status(StatusCode.BAD_REQUEST).json({
                    success: false,
                    message: "Keys must be an array"
                });
            }

            const urls = await Promise.all(
                keys.map(key =>{
                     if(key) {
                         return s3Operation.getImageUrlFromBucket(key);
                     }
                })
            );

            res.status(StatusCode.OK).json(ResponseUtil.success(urls));

        } catch (error) {
            console.error("Error fetching files:", error);
            next(error);
        }
    };

    return getFiles;
};