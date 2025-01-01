import { StatusCode } from "@muhammednajinnprosphere/common";
import express, { NextFunction, Request, Response } from "express";

export const uploadResumeController = (dependencies: any) => {
  console.log("signup");

  const {
    useCases: { getProfileUseCase, uploadResumeUseCase },
  } = dependencies;

  const uploadResume = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("files", req.file);
      
      const { id } = JSON.parse(req.headers['x-user-data'] as string)
      const resume = await uploadResumeUseCase(dependencies).execute({
        file: req.file,
        id,
      });

      res
       .status(StatusCode.CREATED)
       .json({ resume });
       
    } catch (error) {
      console.log(error);
      next(error)
    }
  };
  return uploadResume;
};
