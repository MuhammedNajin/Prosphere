import express, { NextFunction, Request, Response } from "express";

export const getUploadedFileController = (dependencies: any) => {
  console.log("signup");

  const {
    useCases: { getUploadedFileUseCase },
  } = dependencies;

  const getFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { key } = req.params;
      console.log(key, "key");
      const file = await getUploadedFileUseCase(dependencies).execute(key);

      if (!file) {
        throw new Error("not found error");
      }
      console.log(file);
      res.status(200).json(file);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  return getFile;
};
