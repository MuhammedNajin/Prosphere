import express from "express";
import { requireAuth, curentUser } from '@muhammednajinnprosphere/common';
import { companyController } from "../controller/company";

export const companyRoutes = (dependencies: any) => {
  const router = express.Router();
  console.log("profile routes");

  const {
   createCompanyController,
   getCompanyController
  } = companyController(dependencies);
    
  router.post('/setup', createCompanyController);
  router.get('/:id', getCompanyController)
  router.put('/')

  return router;
};
