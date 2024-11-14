import express from "express";
import { validateParams } from '@muhammednajinnprosphere/common';
import { objectIdSchema } from '@muhammednajinnprosphere/common'
import { companyController } from "../controller/company";
import { feilds, upload } from '@presentation/middlewares/multer'
export const companyRoutes = (dependencies: any) => {
  const router = express.Router();
  console.log("profile routes");

  const {
   createCompanyController,
   getCompanyController,
   updateCompanyProfileController,
   upadateCompanyLogoController,
   getFileController,
   getCompanyProfileController,
   uploadCompanyVerificationController,
  } = companyController(dependencies);
    
  router.post('/setup', createCompanyController);
  router.get('/all/:id', getCompanyController);
  router.post('/verify/:id', upload.fields(feilds) ,uploadCompanyVerificationController)
  router 
  .route('/:id')
   .get(getCompanyProfileController)
   .put(updateCompanyProfileController);

  router.post('/logo/:id', validateParams(objectIdSchema), upload.single('file'), upadateCompanyLogoController);
  router.get('/logo/:key', getFileController)
 
  return router;
};
