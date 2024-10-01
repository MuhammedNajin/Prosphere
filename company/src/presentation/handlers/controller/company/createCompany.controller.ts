import express, { NextFunction, Request, Response } from "express";

export const createCompanyController = (dependencies: any) => {
  console.log("signup");

  const {
    useCases: { createCompanyUseCase, getCompanyUseCase },
     messageBroker: { CompanyCreatedProducer, kafka }
  } = dependencies;

  const aboutMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body, req.cookies);

      const { name, url, website, location, size, type, email } = req.body;

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
        owner: email
      });

      await new CompanyCreatedProducer(kafka.producer).produce({
        id: company._id,
        name,
        location,
        owner: email,
      })

      res.status(201).json(company);
      
    } catch (error) {
      console.log(error);
    }
  };
  return aboutMe;
};
