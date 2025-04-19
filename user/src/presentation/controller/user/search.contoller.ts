import { ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";
import express, { NextFunction, Request, Response } from "express";

export const searchController = (dependencies: any) => {
  console.log("signup");

  const {
    useCases: { searchUserUseCase },
  } = dependencies;

  const search = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
       
      const { search } = req.query;
      console.log("search", search)
      const users = await searchUserUseCase(dependencies).execute(search);

      res
       .status(StatusCode.OK)
       .json(ResponseUtil.success(users));
       
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  return search;
};
