import express, { NextFunction, Request, Response } from "express";

export const deleteResumeController = (dependencies: any) => {
  console.log("signup");

  const {
    useCases: { deleteResumeUseCase },
  } = dependencies;

  const deleteResume = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { key } = req.params;
      const { id } = JSON.parse(req.headers['x-user-data'] as string);
      await deleteResumeUseCase(dependencies).execute(key, id);
      res.status(200).json({ success: true });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  return deleteResume;
};
