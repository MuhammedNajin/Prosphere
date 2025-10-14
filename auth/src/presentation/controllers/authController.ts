import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import {
  BadRequestError,
  HttpStatusCode,
} from "@muhammednajinnprosphere/common";

import { UseCases } from "@/di/symbols";
import { SignupUseCase } from "@/application/usecase/auth/signup.usecase";
import { SigninUseCase } from "@/application/usecase/auth/signin.usecase";
import { VerifyOtpUseCase } from "@/application/usecase/auth/verify-otp.usecase";
import { ForgetPasswordUseCase } from "@/application/usecase/auth/forget-pass.usecase";
import { ResetPasswordUseCase } from "@/application/usecase/auth/resetPassUsecase";
import { GoogleAuthUseCase } from "@/application/usecase/auth/google-auth.usecase";
import { GoogleAuthFlowUseCase } from "@/application/usecase/auth/google-auth-flow.usecase";
import { ChangePasswordUseCase } from "@/application/usecase/auth/change-password.usecase";
import { RefreshTokenUseCase } from "@/application/usecase/auth/refresh-token.usecase";
import { ResendOtpUseCase } from "@/application/usecase/auth/resend-otp.usecase";
import {
  getRequestMeta,
  mapUserResponse,
  sendResponse,
  sendAuthResponse,
  setAuthTokenCookies,
  clearAuthTokenCookies,
  getRefreshTokenFromCookie,
} from "@/shared/utils/request-utils";
import { LogoutUseCase } from "@/application/usecase/auth/logout.usecase";

@injectable()
export default class AuthControllers {
  private sendResponse = sendResponse;
  private sendAuthResponse = sendAuthResponse;
  private mapUserResponse = mapUserResponse;
  private getRequestMeta = getRequestMeta;
  private setAuthTokenCookies = setAuthTokenCookies;
  private clearAuthTokenCookies = clearAuthTokenCookies;
  private getRefreshTokenFromCookie = getRefreshTokenFromCookie;

  constructor(
    @inject(UseCases.SignupUseCase)
    private readonly signupUseCase: SignupUseCase,
    @inject(UseCases.SigninUseCase)
    private readonly loginUseCase: SigninUseCase,
    @inject(UseCases.VerifyOtpUseCase)
    private readonly verifyOtpUseCase: VerifyOtpUseCase,
    @inject(UseCases.ForgetPasswordUseCase)
    private readonly forgetPasswordUseCase: ForgetPasswordUseCase,
    @inject(UseCases.ResetPasswordUseCase)
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    @inject(UseCases.GoogleAuthUseCase)
    private readonly googleAuthUseCase: GoogleAuthUseCase,
    @inject(UseCases.GoogleAuthFlowUseCase)
    private readonly googleAuthFlowUseCase: GoogleAuthFlowUseCase,
    @inject(UseCases.ChangePasswordUseCase)
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    @inject(UseCases.RefreshTokenUseCase)
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    @inject(UseCases.LogoutUseCase)
    private readonly logoutUseCase: LogoutUseCase,
    @inject(UseCases.ResendOtpUseCase)
    private readonly resendOtpUseCase: ResendOtpUseCase
  ) {}

  signin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const meta = this.getRequestMeta(req);

    const result = await this.loginUseCase.execute({
      email,
      password,
      ...meta,
    });

    // Set both tokens as HTTP-only cookies
    this.setAuthTokenCookies(res, result.accessToken, result.refreshToken);

    // Send response without tokens in body
    this.sendAuthResponse(
      res,
      HttpStatusCode.OK,
      { 
        ...this.mapUserResponse(result.user)
      },
      "Signin successful"
    );
  };

  googleAuth = async (req: Request, res: Response) => {
    const token = req.headers["authorization"]?.substring(7);
    if (!token) throw new BadRequestError("No authorization token provided");

     const meta = this.getRequestMeta(req);

    const result = await this.googleAuthUseCase.execute({
      token,
      ...meta,
    });

    if (result.profile_complete && result.user && result.accessToken && result.refreshToken) {
      this.setAuthTokenCookies(res, result.accessToken, result.refreshToken);

      this.sendAuthResponse(
        res,
        HttpStatusCode.OK,
        {
          profile_complete: result.profile_complete,
          ...this.mapUserResponse(result.user),
        },
        "Signin successful"
      );
    } else {
      this.sendResponse(
        res,
        HttpStatusCode.OK,
        { profile_complete: false, ...result.user },
        "New user, please complete your profile."
      );
    }
  };

  googleAuthFlow = async (req: Request, res: Response) => {
    const result = await this.googleAuthFlowUseCase.execute({
      ...req.body,
      ...this.getRequestMeta(req),
    });

    // Set both tokens as HTTP-only cookies
    this.setAuthTokenCookies(res, result.accessToken, result.refreshToken);

    this.sendAuthResponse(
      res,
      HttpStatusCode.OK,
      { 
        ...this.mapUserResponse(result.user)
      },
      "Signin successful"
    );
  };

  refreshToken = async (req: Request, res: Response) => {
    // Get refresh token from cookie
    const refreshToken = this.getRefreshTokenFromCookie(req);

    console.log("refresh token >>>>>>>>>>>>>>>!!!!!!!!!!<<<<<<<<<<<<", refreshToken)
    
    if (!refreshToken) {
      throw new BadRequestError("Refresh token not found");
    }

    const result = await this.refreshTokenUseCase.execute({
      refreshToken,
      ...this.getRequestMeta(req),
    });

    // Set new tokens as HTTP-only cookies (token rotation)
    this.setAuthTokenCookies(res, result.accessToken, result.refreshToken);

    this.sendAuthResponse(
      res,
      HttpStatusCode.OK,
      {},
      "Token refreshed successfully"
    );
  };

  verifyOtp = async (req: Request, res: Response) => {
    const { otp, email } = req.body;
    const meta = this.getRequestMeta(req);

    const result = await this.verifyOtpUseCase.execute({
      otpFromUser: otp,
      email,
      ...meta,
    });

    // Set both tokens as HTTP-only cookies
    this.setAuthTokenCookies(res, result.accessToken, result.refreshToken);

    this.sendAuthResponse(
      res,
      HttpStatusCode.OK,
      { 
        ...this.mapUserResponse(result.user)
      },
      "OTP verified successfully"
    );
  };

  logout = async (req: Request, res: Response) => {
  
    const refreshToken = this.getRefreshTokenFromCookie(req);
    const { logoutAll = false, userId} = req.body;
  
    if (!userId) throw new BadRequestError("User not authenticated");

    const result = await this.logoutUseCase.execute({
      userId,
      refreshToken,
      logoutAll,
    });

    // Clear both token cookies
    this.clearAuthTokenCookies(res);

    this.sendResponse(res, HttpStatusCode.OK, result, result.message);
  };

  // Non-auth endpoints remain the same
  signup = async (req: Request, res: Response) => {
    await this.signupUseCase.execute(req.body);
    this.sendResponse(
      res,
      HttpStatusCode.CREATED,
      {},
      "User registered successfully. Please check your email to verify your account."
    );
  };

  resendOtp = async (req: Request, res: Response) => {
    const { email } = req.body;
    console.log("Resending OTP for email:", email);

    await this.resendOtpUseCase.execute({ email });

    this.sendResponse(
      res,
      HttpStatusCode.OK,
      {},
      "OTP has been resent to your email. Please check your inbox."
    );
  };

  forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    await this.forgetPasswordUseCase.execute(email);

    this.sendResponse(
      res,
      HttpStatusCode.OK,
      {},
      "Password reset link sent to your email. Please check your inbox."
    );
  };

  resetPassword = async (req: Request, res: Response) => {
    await this.resetPasswordUseCase.execute(req.body);

    this.sendResponse(
      res,
      HttpStatusCode.OK,
      {},
      "Password reset successfully. Please sign in with your new password."
    );
  };

  changePassword = async (req: Request, res: Response) => {
    const { id, newPassword, oldPassword } = req.body;

    await this.changePasswordUseCase.execute(oldPassword, newPassword, id);

    this.sendResponse(
      res,
      HttpStatusCode.OK,
      {},
      "Password changed successfully"
    );
  };
}