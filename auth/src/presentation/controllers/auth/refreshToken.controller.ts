import { Request, Response, NextFunction } from "express";
import { Dependencies, TokenData } from "@domain/entities/interfaces";
import Token from "@infra/libs/token";
import { ForbiddenError } from '@muhammednajinnprosphere/common'
import jwt  from 'jsonwebtoken'
import { ROLE, TOKEN_TYPE } from "@/shared/types/enums";

const refreshTokenController = (dependencies: Dependencies) => {
  const {
    useCases: { sentMailUseCase, forgetPasswordUseCase },
  } = dependencies;

  const forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
     const { isAdmin } = req.query
     const tokenKey = isAdmin ? TOKEN_TYPE.ADMIN_REFRESH_TOKEN : TOKEN_TYPE.USER_REFRESH_TOKEN;
     const token = req.cookies[tokenKey];

     console.log('refresh-token endpoint', token);
      const secret = isAdmin ? process.env.ADMIN_REFRESH_SECRECT : process.env.REFRESH_SECRECT;
      console.log("secret", secret, req.cookies);
      
      await Token.verifyToken(token, secret!);
      const payload = Token.decode(token) as TokenData;
      console.log("payload", payload);
      const newPayload = {
         id: payload.id,
         email: payload.email,
         username: payload.email,
         role: isAdmin === ROLE.ADMIN ? ROLE.ADMIN : ROLE.USER
      }

     const { accessToken, refreshToken} = Token.generateJwtToken(newPayload);

     res.cookie(`${isAdmin ? TOKEN_TYPE.ADMIN_ACCESS_TOKEN : TOKEN_TYPE.USER_ACCESS_TOKEN}`, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      
      res.cookie(`${isAdmin ? TOKEN_TYPE.ADMIN_REFRESH_TOKEN : TOKEN_TYPE.USER_REFRESH_TOKEN}`, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      res.sendStatus(201);
    } catch (error) {

      console.log("error from refresh token", error);
      
      if(error instanceof jwt.JsonWebTokenError) {
        next(new ForbiddenError())
      }
      next(error)
    }
  };

  return forgotPassword;
};

export { refreshTokenController };
