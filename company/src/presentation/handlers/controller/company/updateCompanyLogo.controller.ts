import express, { NextFunction, Request, Response } from "express";

export const upadateCompanyLogoController = (dependencies: any) => {
  console.log("signup");

  const {
    service: { s3Operation },
    useCases: { updateCompanyLogoUseCase, getCompanyByIdUseCase },
    messageBroker: { CompanyUpdateProducer, kafka },
  } = dependencies;

  const updateCompanyLogo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("files", req.file);
      const { id } = req.params;
      const file = req.file;

      const company = await getCompanyByIdUseCase(dependencies).execute(id);
      console.log("company", company);
      const prevLogo = company.logo;
      let logoUrl = null;
      let key;
      const status = prevLogo
        ? prevLogo.replace(id, "") !== file?.originalname
        : true;

      console.log("prev Logo", prevLogo, "status", status);

      // if (prevLogo && status) {
      //   console.log("Inside if prevLogo", prevLogo);
      //   await s3Operation.deleteImageFromBucket(prevLogo);
      // }

      if (status) {
        const { url, bucketKey } = await updateCompanyLogoUseCase(
          dependencies
        ).execute({
          id,
          file,
        });
        logoUrl = url;
        key = bucketKey;
      }
      console.log(logoUrl);

      await new CompanyUpdateProducer(kafka.producer).produce({
        id,
        logo: key,
      });

      res.status(201).json({
        success: status,
        logoUrl,
        message: `Logo updated successfully: ${status}`,
      });

    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  return updateCompanyLogo;
};
