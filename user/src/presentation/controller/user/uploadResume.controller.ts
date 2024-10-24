import express, { NextFunction, Request, Response } from "express";

export const uploadResumeController = (dependencies: any) => {
  console.log("signup");

  const {
    useCases: { getProfileUseCase, uploadResumeUseCase },
  } = dependencies;

  const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("body", req.query);
      console.log("files", req.file);
      const { email } = req.query;

      const profile = await getProfileUseCase(dependencies).execute({
        email,
      });

      console.log("Profile", profile)

      const resume = await uploadResumeUseCase(dependencies).execute({
        file: req.file,
        profile,
        email,
      });

      res.status(201).json({ resume });
    } catch (error) {
      console.log(error);
    }
  };
  return createUser;
};
