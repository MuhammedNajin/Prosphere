import { Request, Response, NextFunction, json } from "express";
import { Dependencies } from "@domain/entities/interfaces";
import Token from "@infra/libs/token";
import { TOKEN_TYPE } from "@/shared/types/enums";

const googleAuthController = (dependencies: Dependencies) => {
  const {
    useCases: { googleAuthUseCase },
  } = dependencies;

  const googleAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers["authorization"]?.substring(7) as string;
      console.log("token", token);

      const { status, user } = await googleAuthUseCase(dependencies).execute(
        token
      );

      console.log(" status , user ", status, user);

      if (status === "exist") {
        const payload = {
          id: user._id,
          email: user.email,
          username: user.username,
          role: "user" as "user",
        };
        const { accessToken, refreshToken } = Token.generateJwtToken(payload);

        res.cookie(TOKEN_TYPE.USER_ACCESS_TOKEN, accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });

        res.cookie(TOKEN_TYPE.USER_REFRESH_TOKEN, refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });
      }

      res.status(201).json({ status, user });
    } catch (error) {
      console.log(error);
    }
  };

  return googleAuth;
};

export { googleAuthController };
