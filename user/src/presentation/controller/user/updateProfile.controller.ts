import express, { NextFunction, Request, Response } from "express";

export const updateProfileController = (dependencies: any) => {
  console.log("update profile");

  const {
    useCases: { updateProfileUseCase },
  } = dependencies;

  const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("body", req.body, req.query);
      const { email } = req.params;
      const { array } = req.query;
      const isArray = array === "true" ? true : false;
      const profile = await updateProfileUseCase(dependencies).execute({
        email,
        body: req.body,
        array: isArray,
      });
      console.log("profile update", profile);
      res.status(201).json({
        message: true,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  return createUser;
};
