import express from "express";
import { resolve } from "@/di/index";
import UserControllers from "@/presentation/controller/user-controller";
import { asyncHandler } from "@muhammednajinnprosphere/common";
import { Controllers } from "@/di/symbols";
import { upload } from "./middleware/multer";

const router = express.Router();

const userController = resolve<UserControllers>(
  Controllers.UserControllers
);

router.get('/search', asyncHandler(userController.search));

router.route('/')
 .get(asyncHandler(userController.getProfile))
 .put(asyncHandler(userController.updateProfile));

router.route('/:id')
 .get(asyncHandler(userController.getUser))
 

// GET /api/v1/users?search=query - Search users

// PUT /api/v1/users/:id/about - Update user about section
router.put('/:id/about', asyncHandler(userController.aboutMe));

// POST /api/v1/users/:id/avatar - Upload profile photo
router.post('/avatar', upload.single('image'), asyncHandler(userController.uploadProfilePhoto));

// POST /api/v1/users/:id/resume - Upload resume
router.post('/resume', upload.single('resume'), asyncHandler(userController.uploadResume));

// DELETE /api/v1/users/:id/resume/:key - Delete specific resume
router.delete('/resume/:key', asyncHandler(userController.deleteResume));

// GET /api/v1/users/files/:key - Get uploaded file by key
router.get('/files/:key', asyncHandler(userController.getUploadedFile));

// POST /api/v1/users/files - Get multiple files
router.post('/files', asyncHandler(userController.getFiles));

export default router;