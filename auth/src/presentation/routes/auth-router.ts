// src/routes/auth.ts
import express from "express";
import { resolve } from "@di/index";
import AuthControllers from "@/presentation/controllers/authController";
import { asyncHandler } from "@muhammednajinnprosphere/common";
import { Controllers } from "@/di/symbols";

const router = express.Router();

const authController = resolve<AuthControllers>(
  Controllers.AuthControllers
);

router.post("/signin", asyncHandler(authController.signin));
router.post("/signup", asyncHandler(authController.signup));
router.post("/verify-otp", asyncHandler(authController.verifyOtp));
router.post("/logout", asyncHandler(authController.logout));
router.post("/google-auth", asyncHandler(authController.googleAuth));
router.post("/resent-otp", asyncHandler(authController.googleAuthFlow));
router.post("/forget-password", asyncHandler(authController.forgotPassword));
router.post(
  "/reset-password/:token",
  asyncHandler(authController.resetPassword)
);
router.post("/admin-login", asyncHandler(authController.signin));
router.post("/refresh-token", asyncHandler(authController.verifyOtp));
router.post("/change-password", asyncHandler(authController.changePassword));

export default router;
