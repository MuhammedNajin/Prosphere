import express, { NextFunction, Request, Response } from "express";

export const uploadProfilePhotoController = (dependencies: any) => {
  console.log("signup");

  const {
    useCases: { getProfileUseCase, uploadProfilePhotoUseCase },
  } = dependencies;

  const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("body", req.query);
      console.log("files", req.file);
      const { key, email } = req.query;

      const profile = await getProfileUseCase(dependencies).execute({
        email,
      });

      const avatar = await uploadProfilePhotoUseCase(dependencies).execute({
        file: req.file,
        profile,
        email,
        key
      });

      res.status(201).json({ avatar });
    } catch (error) {
      console.log(error);
    }
  };
  return createUser;
};
