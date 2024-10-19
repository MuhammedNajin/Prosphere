import express, { NextFunction, Request, Response } from "express";

export const getCompanyController = (dependencies: any) => {
  console.log("signup");

  const {

    useCases: { getMyCompanyUseCase },

  } = dependencies;

  const getCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body, req.query, "dee");
      const { id } = req.params;

      const company = await getMyCompanyUseCase(dependencies).execute(id);
      console.log("company", company)
      res.status(200).json(company);
      
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  return getCompany;
};
