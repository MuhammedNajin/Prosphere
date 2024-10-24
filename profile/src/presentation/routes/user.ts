import express from "express";
import { profileController } from "../controller";
import { requireAuth, curentUser } from '@muhammednajinnprosphere/common';
import { upload } from "./middleware/multer";

export const profileRoutes = (dependencies: any) => {
  const router = express.Router();
  console.log("profile routes");

  const {
    uploadProfilePhotoController,
    aboutController,
    getProfileController,
    updateProfileController,
    uploadResumeController,
    getUploadedFileController
  } = profileController(dependencies);
    
  router.post('/photo', upload.single('image'), uploadProfilePhotoController);
  router.post('/resume', upload.single('resume'), uploadResumeController);
  router.get('/file/:key', getUploadedFileController);
  router.put('/about', aboutController);
  router.get('/:email', getProfileController);
  router.put('/:email', updateProfileController)
  return router;
};
