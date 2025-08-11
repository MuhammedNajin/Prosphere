import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import {
  HttpStatusCode,
  BadRequestError,
  ForbiddenError,
  ResponseWrapper,
  ResponseMapper,
} from "@muhammednajinnprosphere/common";

import { ROLE, TOKEN_TYPE } from "@/shared/types/enums";
import { AdminLoginUseCase } from "@/application/usecase/admin/admin-login.usecase";
import { RefreshTokenUseCase } from "@/application/usecase/auth/refresh-token.usecase";
import { BlockUserUseCase } from "@/application/usecase/admin/blockUserUsecase";
import { GetUsersUseCase } from "@/application/usecase/admin/getUsersUsecase";
import { IAuth } from "@/domain/interface/IAuth";
import { AdminGetUsersResponse, SigninResponse } from "../IResponse";
import { NodeEnv } from "@/shared/constance";
import { UseCases } from "@/di/symbols";

@injectable()
export default class AdminControllers {
  constructor(
    @inject(UseCases.BlockUserUseCase)
    private readonly blockUserUseCase: BlockUserUseCase,
    @inject(UseCases.GetUsersUseCase)
    private readonly getUsersUseCase: GetUsersUseCase,
    @inject(UseCases.AdminRefreshTokenUseCase)
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    @inject(UseCases.AdminLoginUseCase)
    private readonly adminLoginUseCase: AdminLoginUseCase
  ) {}

  blockUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const blocked = await this.blockUserUseCase.execute(id);
    if (!blocked) {
      throw new BadRequestError("Something went wrong while blocking the user");
    }

    const resWrap = new ResponseWrapper(res);
    resWrap
      .status(HttpStatusCode.OK)
      .success(blocked, "User blocked successfully");
  };

  getAllUsers = async (req: Request, res: Response) => {
    const { page, limit } = req.query;

    const result = await this.getUsersUseCase.execute({
      page: parseInt(page as string, 10) || 1,
      limit: parseInt(limit as string, 10) || 10,
    });

    const userMapper = new ResponseMapper<IAuth, SigninResponse>({
      fields: {
        id: "id",
        email: "email",
        username: "username",
        phone: "phone",
        role: "role",
        createdAt: "createdAt",
        updatedAt: "updatedAt",
      },
    });

    const response = new ResponseMapper<
      { users: IAuth[]; total: number },
      AdminGetUsersResponse
    >({
      fields: {
        total: "total",
        users: ({ users }) => userMapper.toResponseList(users),
      },
    }).toResponse(result);

    const resWrap = new ResponseWrapper(res);

     resWrap
      .status(HttpStatusCode.OK)
      .success(response, "Users fetched successfully");
  };

 logout = (req: Request, res: Response) => {
  const resWrap = new ResponseWrapper(res);

  resWrap
    .cookie(TOKEN_TYPE.ADMIN_ACCESS_TOKEN, '', {
      httpOnly: true,
      expires: new Date(0),
      sameSite: process.env.NODE_ENV === NodeEnv.PRODUCTION ? "none" : "lax",
      secure: process.env.NODE_ENV === NodeEnv.PRODUCTION,
    })
    .cookie(TOKEN_TYPE.ADMIN_REFRESH_TOKEN, '', {
      httpOnly: true,
      expires: new Date(0),
      sameSite: process.env.NODE_ENV === NodeEnv.PRODUCTION ? "none" : "lax",
      secure: process.env.NODE_ENV === NodeEnv.PRODUCTION,
    })
    .status(HttpStatusCode.NO_CONTENT)
    .success({}, "Successfully logged out.");
};


 refreshToken = async (req: Request, res: Response) => {
   const refreshToken = req.cookies[TOKEN_TYPE.ADMIN_REFRESH_TOKEN];
 
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
 
}
