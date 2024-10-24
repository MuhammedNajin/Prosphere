import express, { NextFunction, Request, Response } from "express";


export const getUploadedFileController = (dependencies: any) => {
  console.log("signup");
  
  const {
    useCases: { getUploadFileUseCase },
  } = dependencies;
  
  
  const getFile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
        const { key } = req.params;
        const file = await getUploadFileUseCase(dependencies).execute(key)
        
        if(!file) {
            throw new Error("not found error");
        }

        res.status(200).json(file);
        
    } catch (error) {

        console.log(error);
        
    }
  }
  return getFile;
};
