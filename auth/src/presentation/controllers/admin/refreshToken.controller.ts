import { Request, Response, NextFunction } from "express";
import { Dependencies, TokenData } from "@domain/entities/interfaces";
import Token from "@infra/libs/token";
import { ForbiddenError } from "@muhammednajinnprosphere/common";
import jwt from "jsonwebtoken";
import { ROLE, TOKEN_TYPE } from "@/shared/types/enums";

const adminRefreshTokenController = (dependencies: Dependencies) => {
  const {
    useCases: { sentMailUseCase, forgetPasswordUseCase },
  } = dependencies;

  const forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const tokenKey = TOKEN_TYPE.ADMIN_REFRESH_TOKEN;

      const token = req.cookies[tokenKey];

      console.log("refresh-token endpoint", token);

      const secret = process.env.ADMIN_REFRESH_SECRECT;

      console.log("secret", secret, req.cookies);

      await Token.verifyToken(token, secret!);

      const payload = Token.decode(token) as TokenData;

      console.log("payload", payload);

      const newPayload = {
        id: payload.id,
        email: payload.email,
        username: payload.email,
        role: ROLE.ADMIN,
      };

      const { accessToken, refreshToken } = Token.generateJwtToken(newPayload);

      res.cookie(TOKEN_TYPE.ADMIN_ACCESS_TOKEN, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });

      res.cookie(TOKEN_TYPE.ADMIN_REFRESH_TOKEN, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });

      res.sendStatus(201);
    } catch (error) {
      console.log("error from refresh token", error);

      if (error instanceof jwt.JsonWebTokenError) {
        next(new ForbiddenError());
      }

      next(error);
    }
  };

  return forgotPassword;
};

export { adminRefreshTokenController };
