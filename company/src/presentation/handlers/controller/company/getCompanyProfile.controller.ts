import express, { NextFunction, Request, Response } from "express";

export const getCompanyProfileController = (dependencies: any) => {
  console.log("signup");

  const {

    useCases: { getCompanyByIdUseCase },

  } = dependencies;

  const getCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body, req.params, "dee");
      const { id } = req.params;

      const company = await getCompanyByIdUseCase(dependencies).execute(id);
      console.log("company", company)
      res.status(200).json(company);
      
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  return getCompany;
};
