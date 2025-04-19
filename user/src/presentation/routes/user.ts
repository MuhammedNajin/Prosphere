import express from "express";
import { profileController } from "../controller";
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
    getUploadedFileController,
    getFilesController,
    deleteResumeController,
    searchController
  } = profileController(dependencies);
    
  router.get('/search', searchController);
  router.post('/photo', upload.single('image'), uploadProfilePhotoController);
  router.post('/resume', upload.single('resume'), uploadResumeController);
  router.get('/file/:key', getUploadedFileController);
  router.put('/about', aboutController);
  router.get('/:id', getProfileController);
  router.put('/:email', updateProfileController)
  router.post('/files', getFilesController);
  router.delete('/resume/:key',  deleteResumeController);

  return router;
};
