import express, { NextFunction, Request, Response } from "express";
import { StatusCode } from "@muhammednajinnprosphere/common";
export const createCompanyController = (dependencies: any) => {
  console.log("signup");

  const {
    useCases: { createCompanyUseCase, getCompanyUseCase },
    messageBroker: { CompanyCreatedProducer, kafka },
  } = dependencies;

  const createCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body, req.headers["x-user-data"]);

      const { name, url, website, location, size, type, id } = req.body;

      const companyExist = await getCompanyUseCase(dependencies).execute(url);

      if (companyExist) {
        throw new Error("comapy exist");
      }

      const company = await createCompanyUseCase(dependencies).execute({
        name,
        url,
        website,
        location,
        size,
        type,
        owner: id,
      });

      await new CompanyCreatedProducer(kafka.producer).produce({
        _id: company._id,
        name,
        location,
        owner: id,
      });

      res
      .status(StatusCode.CREATED)
      .json(company);

    } catch (error) {
      console.log(error);
      next(error)
    }
  };
  
  return createCompany;
};
