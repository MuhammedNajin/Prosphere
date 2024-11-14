import express from "express";
import { validateParams } from '@muhammednajinnprosphere/common';
import { objectIdSchema } from '@muhammednajinnprosphere/common'
import { adminController } from "../controller/admin";
import { companyController } from "../controller/company";

export const adminRoutes = (dependencies: any) => {
  const router = express.Router();
  console.log("profile routes");

  const {  
   getCompaniesController,
   getCompanyController,
   changeCompanyStatusController,
   getVerificatonDocsController
  } = adminController(dependencies);

 
    
 router.get('/company/verification', getCompaniesController);
 router.get('/company/:id', getCompanyController);
 router.patch('/company/status/:id', changeCompanyStatusController);
 router.get('/company/doc/:key', getVerificatonDocsController);

  return router;
};
