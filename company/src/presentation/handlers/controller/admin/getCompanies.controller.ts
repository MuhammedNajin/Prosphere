import express, { NextFunction, Request, Response } from "express";
import { StatusCode, ResponseUtil } from "@muhammednajinnprosphere/common";
export const getCompaniesController = (dependencies: any) => {
  const {
    useCases: { getCompaniesUseCase },
  } = dependencies;

  const getCompanies = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {

      const company = await getCompaniesUseCase(dependencies).execute();
      console.log("company", company);
      res
      .status(StatusCode.OK)
      .json(
        ResponseUtil.success(company)
      );

    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  return getCompanies;
};
