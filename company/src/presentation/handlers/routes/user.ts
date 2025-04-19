import express from "express";
import { validateParams } from '@muhammednajinnprosphere/common';
import { objectIdSchema } from '@muhammednajinnprosphere/common'
import { companyController } from "../controller/company";
import { feilds, upload } from "@/presentation/middlewares/multer";



export const userRoutes = (dependencies: any) => {
  const router = express.Router();
  console.log("user routes");

  const {
 
   getCompanyController,
   generateCompanyAccessTokenController,
   createCompanyController,
   uploadCompanyVerificationController,
   getCompanyProfileController,
   getEmployeeController
  } = companyController(dependencies);
    
  router.use((req, res, next) => {
    console.log("user router ", req.url)
    next()
  })
  router.post('/company/verify/:id', upload.fields(feilds) , uploadCompanyVerificationController)
  router.get('/company/my-company', getCompanyController);
  router.post('/company/token/:id', generateCompanyAccessTokenController)
  router.post('/company/setup', createCompanyController);
  router.get('/company/profile/:id', getCompanyProfileController);
  router.get('/company/employees', getEmployeeController)
  return router;


};
