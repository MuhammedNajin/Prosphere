import { ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";
import express, { NextFunction, Request, Response } from "express";

export const addEmployeeController = (dependencies: any) => {

  const {
    service: { s3Operation },
    useCases: { addEmployeeUseCase, getCompanyByIdUseCase },
  } = dependencies;

  const addEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("add team controller", req.params, JSON.parse(req.headers['x-company-data'] as string));
      const { id: userId } = req.params;
      const companyId = JSON.parse(req.headers['x-company-data'] as string).id
      const employee = await addEmployeeUseCase(dependencies).execute(companyId, userId);

      res
       .status(StatusCode.CREATED)
       .json(ResponseUtil.success(employee));
       
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  return addEmployee;
};
