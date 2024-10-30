import { Request, Response, NextFunction } from "express";
import { Dependencies, TokenData } from "@domain/entities/interfaces";
import Token from "@infra/libs/token";
import { ForbiddenError } from '@muhammednajinnprosphere/common'
import jwt  from 'jsonwebtoken'

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
      
     const token = req.cookies.accessToken
     console.log('refresh-token endpoint', token);
      await Token.verifyToken(token, process.env.REFRESH_SECRECT!);
      const payload = Token.decode(token) as TokenData;
      console.log("payload", payload);
     const { accessToken, refreshToken} = Token.generateJwtToken(payload);

     res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      res.sendStatus(201);
    } catch (error) {
      console.log(error);
      
      if(error instanceof jwt.JsonWebTokenError) {
        next(new ForbiddenError())
      }
      next(error)
    }
  };

  return forgotPassword;
};

export { refreshTokenController };
