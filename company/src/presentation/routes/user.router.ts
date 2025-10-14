import express from "express";
import { resolve } from "@/di/index";
import UserControllers from "@/presentation/controller/user-controller";
import { asyncHandler } from "@muhammednajinnprosphere/common";
import { Controllers } from "@/di/symbols";
import { upload } from "../middlewares/multer";

const router = express.Router();

const userController = resolve<UserControllers>(
  Controllers.UserControllers
);

// GET /api/v1/users?search=query - Search users
router.post('/companies', asyncHandler(userController.createCompany));
router.get('/companies/me', asyncHandler(userController.getMyCompany));
router.get('/search', asyncHandler(userController.search));

router.post(
  "/companies/:id/access-token",
  // POST /api/v1/companies/:id/access-token - Generate company access token
  asyncHandler(userController.generateCompanyAccessToken)
);


router.put(
  "/companies/:id/verification-docs",
  // PUT /api/v1/companies/:id/verification-docs - Upload verification documents
  upload.fields([
    { name: 'companyDoc', maxCount: 1 },
    { name: 'ownerDoc', maxCount: 1 }
  ]),
  asyncHandler(userController.uploadCompanyVerificationDocs)
);

export default router;