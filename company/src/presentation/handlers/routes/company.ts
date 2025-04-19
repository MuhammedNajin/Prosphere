import express from "express";
import { validateParams } from "@muhammednajinnprosphere/common";
import { objectIdSchema } from "@muhammednajinnprosphere/common";
import { companyController } from "../controller/company";
import { upload } from "@presentation/middlewares/multer";


export const companyRoutes = (dependencies: any) => {
  const router = express.Router();
  console.log("profile routes");

  const {
    updateCompanyProfileController,
    upadateCompanyLogoController,
    getFileController,
    getCompanyProfileController,
    addEmployeeController,
    searchUserController,
    getEmployeeController,
    getFilesController
  } = companyController(dependencies);
  
  router.get("/employee", searchUserController);
  router.get("/employees", getEmployeeController)
  router
    .route("/:id")
    .get(getCompanyProfileController)
    .put(updateCompanyProfileController);

  router.post(
    "/logo/:id",
    validateParams(objectIdSchema),
    upload.single("file"),
    upadateCompanyLogoController
  );
  router.get("/logo/:key", getFileController);
  router.put("/employee/:id", addEmployeeController);
  router.post('/files', getFilesController);
 
  return router;
};
