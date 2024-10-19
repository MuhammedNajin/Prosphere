import { signupController } from "./signup.controller";
import { loginController } from "./login.controller";
import { verifyOTPController } from "./verifyOTP.controller";
import { logoutController } from "./logout.controller";
import { googleAuthController } from "./googleAuth.controller";
import { resentOTPController } from "./resentOtp.controller";
import { forgotPasswordController } from "./forgotPassword.controller";
import { resetPasswordController } from "./resetPassword.controller";
import { adminLoginController } from "./adminLogin.controller";
import { refreshTokenController } from './refreshToken.controller'

export const authController = (dependencies: any) => {
  console.log("auth controller");

  return {
    signupController: signupController(dependencies),
    loginController: loginController(dependencies),
    verifyOTPController: verifyOTPController(dependencies),
    logoutController: logoutController(dependencies),
    googleAuthController: googleAuthController(dependencies),
    resentOTPController: resentOTPController(dependencies),
    forgotPasswordController: forgotPasswordController(dependencies),
    resetPasswordController: resetPasswordController(dependencies),
    adminLoginController: adminLoginController(dependencies),
    refreshTokenController: refreshTokenController(dependencies),
  };
};
