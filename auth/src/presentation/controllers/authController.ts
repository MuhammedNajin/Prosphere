import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { SignupUseCase } from "@/application/usecase/auth/signup.usecase";
import { SigninUseCase } from "@application/usecase/auth/signin.usecase";
import { VerifyOtpUseCase } from "@/application/usecase/auth/verify-otp.usecase";
import { ForgetPasswordUseCase } from "@/application/usecase/auth/forget-pass.usecase";
import { ResetPasswordUseCase } from "@/application/usecase/auth/resetPassUsecase";
import { GoogleAuthUseCase } from "@/application/usecase/auth/google-auth.usecase";
import { GoogleAuthFlowUseCase } from "@/application/usecase/auth/google-auth-flow.usecase";
import { ChangePasswordUseCase } from "@/application/usecase/auth/change-password.usecase";
import { BadRequestError, HttpStatusCode, ResponseMapper, ResponseWrapper } from "@muhammednajinnprosphere/common";
import { TOKEN_TYPE } from "@/shared/types/enums";
import { NodeEnv } from "@/shared/constance";
import { IAuth } from "@/domain/interface/IAuth";
import { SigninResponse } from "../IResponse";
import { RefreshTokenUseCase } from "@/application/usecase/auth/refresh-token.usecase";
import { UseCases } from "@/di/symbols";

@injectable()
export default class AuthControllers {
  constructor(
    @inject(UseCases.SignupUseCase) private readonly signupUseCase: SignupUseCase,
    @inject(UseCases.SigninUseCase) private readonly loginUseCase: SigninUseCase,
    @inject(UseCases.VerifyOtpUseCase) private readonly verifyOtpUseCase: VerifyOtpUseCase,
    @inject(UseCases.ForgetPasswordUseCase) private readonly forgetPasswordUseCase: ForgetPasswordUseCase,
    @inject(UseCases.ResetPasswordUseCase) private readonly resetPasswordUseCase: ResetPasswordUseCase,
    @inject(UseCases.GoogleAuthUseCase) private readonly googleAuthUseCase: GoogleAuthUseCase,
    @inject(UseCases.GoogleAuthFlowUseCase) private readonly googleAuthFlowUseCase: GoogleAuthFlowUseCase,
    @inject(UseCases.ChangePasswordUseCase) private readonly changePasswordUseCase: ChangePasswordUseCase,
    @inject(UseCases.RefreshTokenUseCase) private readonly refreshTokenUseCase: RefreshTokenUseCase,

  ) {}

  signin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await this.loginUseCase.execute({ email, password });

    const response = new ResponseMapper<IAuth, SigninResponse>({
       fields: {
        id: "id",
        email: "email",
        username: "username",
        phone: "phone",
        role: "role",
        createdAt: "createdAt",
        updatedAt: "updatedAt",
       }
    }).toResponse(user);

    const resWrap = new ResponseWrapper(res);

    resWrap
      .status(HttpStatusCode.OK)
      .cookie(TOKEN_TYPE.USER_REFRESH_TOKEN, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === NodeEnv.PRODUCTION,
        sameSite: process.env.NODE_ENV === NodeEnv.PRODUCTION ? "none" : "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .cookie(TOKEN_TYPE.USER_ACCESS_TOKEN, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === NodeEnv.PRODUCTION,
        sameSite: process.env.NODE_ENV === NodeEnv.PRODUCTION ? "none" : "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .success(response, "Signin successful");
  };

  googleAuth = async (req: Request, res: Response) => {
    const token = req.headers["authorization"]?.substring(7);
    if (!token) {
      throw new BadRequestError("No authorization token provided");
    }
    const result = await this.googleAuthUseCase.execute(token);

    const resWrap = new ResponseWrapper(res);

    if (result.profile_complete && result.user) {
      const { accessToken, refreshToken, user } = result;
      
      const response = new ResponseMapper<IAuth, SigninResponse>({
        fields: {
          id: "id",
          email: "email",
          username: "username",
          phone: "phone",
          role: "role",
          createdAt: "createdAt",
          updatedAt: "updatedAt",
        }
      }).toResponse(user);

      
      
      resWrap
      .status(HttpStatusCode.OK)
      .cookie(TOKEN_TYPE.USER_REFRESH_TOKEN, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === NodeEnv.PRODUCTION,
        sameSite: process.env.NODE_ENV === NodeEnv.PRODUCTION ? "none" : "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .cookie(TOKEN_TYPE.USER_ACCESS_TOKEN, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === NodeEnv.PRODUCTION,
        sameSite: process.env.NODE_ENV === NodeEnv.PRODUCTION ? "none" : "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .success(response, "Signin successful");
       
    } else {

      resWrap
        .status(HttpStatusCode.OK)
        .success({ profile_complete: false, user: null }, "New user, please complete your profile.");
    }
  };

  googleAuthFlow = async (req: Request, res: Response) => {
    const result = await this.googleAuthFlowUseCase.execute(req.body);
    const { accessToken, refreshToken, user } = result;
    
    const response = new ResponseMapper<IAuth, SigninResponse>({
      fields: {
        id: "id",
        email: "email",
        username: "username",
        phone: "phone",
        role: "role",
        createdAt: "createdAt",
        updatedAt: "updatedAt",
      }
    }).toResponse(user);

    const resWrap = new ResponseWrapper(res);
    
    resWrap
      .status(HttpStatusCode.OK)
      .cookie(TOKEN_TYPE.USER_REFRESH_TOKEN, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === NodeEnv.PRODUCTION,
        sameSite: process.env.NODE_ENV === NodeEnv.PRODUCTION ? "none" : "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .cookie(TOKEN_TYPE.USER_ACCESS_TOKEN, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === NodeEnv.PRODUCTION,
        sameSite: process.env.NODE_ENV === NodeEnv.PRODUCTION ? "none" : "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .success(response, "Signin successful");
  };


  refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies[TOKEN_TYPE.USER_REFRESH_TOKEN];

  if (!refreshToken) {
    throw new BadRequestError("Refresh token not found in cookies");
  }

  const { accessToken, refreshToken: newRefreshToken } = await this.refreshTokenUseCase.execute(refreshToken);

  const resWrap = new ResponseWrapper(res);

  resWrap
    .status(HttpStatusCode.OK)
    .cookie(TOKEN_TYPE.USER_REFRESH_TOKEN, newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === NodeEnv.PRODUCTION,
      sameSite: process.env.NODE_ENV === NodeEnv.PRODUCTION ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    .cookie(TOKEN_TYPE.USER_ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === NodeEnv.PRODUCTION,
      sameSite: process.env.NODE_ENV === NodeEnv.PRODUCTION ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    .success({}, "Token refreshed successfully");
};


  signup = async (req: Request, res: Response) => {
    await this.signupUseCase.execute(req.body);

    const resWrap = new ResponseWrapper(res);

    resWrap
     .status(HttpStatusCode.CREATED)
     .success({}, "User registered successfully. Please check your email to verify your account.");
  };

  verifyOtp = async (req: Request, res: Response): Promise<void> => {
    const { user, accessToken, refreshToken } = await this.verifyOtpUseCase.execute(req.body);
    
    const response = new ResponseMapper<IAuth, SigninResponse>({
      fields: {
        id: "id",
        email: "email",
        username: "username",
        phone: "phone",
        role: "role",
        createdAt: "createdAt",
        updatedAt: "updatedAt",
      }
    }).toResponse(user);

    const resWrap = new ResponseWrapper(res);

    resWrap
      .status(HttpStatusCode.OK)
      .cookie(TOKEN_TYPE.USER_REFRESH_TOKEN, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === NodeEnv.PRODUCTION,
        sameSite: process.env.NODE_ENV === NodeEnv.PRODUCTION ? "none" : "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .cookie(TOKEN_TYPE.USER_ACCESS_TOKEN, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === NodeEnv.PRODUCTION,
        sameSite: process.env.NODE_ENV === NodeEnv.PRODUCTION ? "none" : "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .success(response, "OTP verified successfully");
  };

  forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    await this.forgetPasswordUseCase.execute(email);
      const resWrap = new ResponseWrapper(res);
    resWrap
      .status(HttpStatusCode.OK)
      .success({}, "Password reset link sent to your email. Please check your inbox.");
  };

  resetPassword = async (req: Request, res: Response) => {
    await this.resetPasswordUseCase.execute(req.body);

    const resWrap = new ResponseWrapper(res);
    resWrap
      .status(HttpStatusCode.OK)
      .success({}, "Password reset successfully. Please sign in with your new password.");
  }

  logout = (req: Request, res: Response) => {
  const resWrap = new ResponseWrapper(res);

  resWrap
    .cookie(TOKEN_TYPE.USER_ACCESS_TOKEN, '', {
      httpOnly: true,
      expires: new Date(0),
      sameSite: process.env.NODE_ENV === NodeEnv.PRODUCTION ? "none" : "lax",
      secure: process.env.NODE_ENV === NodeEnv.PRODUCTION,
    })
    .cookie(TOKEN_TYPE.USER_REFRESH_TOKEN, '', {
      httpOnly: true,
      expires: new Date(0),
      sameSite: process.env.NODE_ENV === NodeEnv.PRODUCTION ? "none" : "lax",
      secure: process.env.NODE_ENV === NodeEnv.PRODUCTION,
    })
    .status(HttpStatusCode.NO_CONTENT)
    .success({}, "Successfully logged out.");
};


  changePassword = async (req: Request, res: Response) => {
    const { id, newPassword, oldPassword } = req.body;
    await this.changePasswordUseCase.execute(oldPassword, newPassword, id);
    
    const resWrap = new ResponseWrapper(res);
    resWrap
      .status(HttpStatusCode.OK)
      .success({}, "Password changed successfully");
  };
}