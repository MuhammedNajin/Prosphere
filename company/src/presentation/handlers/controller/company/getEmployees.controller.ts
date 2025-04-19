import { ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";
import express, { NextFunction, Request, Response } from "express";

export const getEmployeeController = (dependencies: any) => {
  console.log("signup");

  const {
    useCases: { getEmployeesUseCase },
  } = dependencies;

  const addEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("get team controller", req.headers['x-company-data']);
      let companyId = null;
      if(req.headers['x-company-data']) {
         companyId = JSON.parse(req.headers['x-company-data'] as string).id;
      } else { 
         companyId = req.query.companyId
      }
      
      
      const employees = await getEmployeesUseCase(dependencies).execute(companyId);

      res
       .status(StatusCode.OK)
       .json(ResponseUtil.success(employees));
       
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  return addEmployee;
};
