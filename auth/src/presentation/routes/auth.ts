import express from "express";

import { authController } from "../controllers";

import { requireAuth, curentUser } from '@muhammednajinnprosphere/common'

export const authRoutes = (dependencies: any) => {
  const router = express.Router();
  console.log("authroutes");

  const {
    signupController,
    loginController,
    verifyOTPController,
    logoutController,
    googleAuthController,
    resentOTPController,
    forgotPasswordController,
    resetPasswordController,
    adminLoginController,
    refreshTokenController,
  } = authController(dependencies);

  router.post("/login",
     loginController);
     
  router.post("/signup", 
    signupController);
    
  router.post("/verify-otp",
     verifyOTPController);

  router.post("/logout", 
    logoutController);

  router.post("/google-auth", 
    googleAuthController);

  router.post("/resent-otp",
     resentOTPController);

  router.post("/forget-password", 
    forgotPasswordController);

  router.post("/reset-password/:token", 
    resetPasswordController);

  router.post("/admin-login", 
    adminLoginController);

  router.post("/refreshToken", 
    refreshTokenController);

  return router;
};
