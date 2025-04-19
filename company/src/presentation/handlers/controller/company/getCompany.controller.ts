import express, { NextFunction, Request, Response } from "express";

export const getCompanyController = (dependencies: any) => {
  console.log("signup");

  const {

    useCases: { getMyCompanyUseCase },

  } = dependencies;

  const getCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = JSON.parse(req.headers['x-user-data'] as string)
      console.log(req.body, req.query, "dee",  user);
    
      const company = await getMyCompanyUseCase(dependencies).execute(user.id);
      console.log("company", company)
      res.status(200).json(company);
      
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  return getCompany;
};
