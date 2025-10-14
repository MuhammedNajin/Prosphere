import { ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";
import express, { NextFunction, Request, Response } from "express";

export const searchUserController = (dependencies: any) => {
  console.log("signup searchUserUseCase", dependencies);

  const {

    useCases: { searchUserUseCase },

  } = dependencies;

  const searchUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

    console.log("searchUser", req.query);
    const { search } = req.query;
     const users = await searchUserUseCase(dependencies).execute(search);
    
     res
      .status(StatusCode.OK)
      .json(ResponseUtil.success(users));

    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  return searchUser;
};
