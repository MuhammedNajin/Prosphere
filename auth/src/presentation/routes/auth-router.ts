import express from "express";
import { resolve } from "@di/index";
import AuthControllers from "@/presentation/controllers/authController";
import { asyncHandler } from "@muhammednajinnprosphere/common";
import { Controllers } from "@/di/symbols";
import AdminControllers from "../controllers/adminController";

const router = express.Router();

const authController = resolve<AuthControllers>(
  Controllers.AuthControllers
);

const adminController = resolve<AdminControllers>(
  Controllers.AdminControllers)

router.post("/admin/login", asyncHandler(adminController.login));

router.post("/signin", asyncHandler(authController.signin));
router.post("/resent-otp", asyncHandler(authController.resendOtp));
router.post("/signup", asyncHandler(authController.signup));
router.post("/verify-otp", asyncHandler(authController.verifyOtp));
router.post("/logout", asyncHandler(authController.logout));
router.post("/google-auth", asyncHandler(authController.googleAuth));
router.post("/forget-password", asyncHandler(authController.forgotPassword));
router.post(
  "/reset-password",
  asyncHandler(authController.resetPassword)
);

router.post("/refresh-token", asyncHandler(authController.refreshToken));
router.post("/change-password", asyncHandler(authController.changePassword));
router.put("/google/flow", asyncHandler(authController.googleAuthFlow));

export default router;
