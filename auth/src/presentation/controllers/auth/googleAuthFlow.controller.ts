import { Request, Response, NextFunction, json } from "express";
import { Dependencies } from "@domain/entities/interfaces";
import Token from "@infra/libs/token";

const googleAuthController = (dependencies: Dependencies) => {
  const {
    useCases: { googleAuthFlowUseCase },
  } = dependencies;

  const googleAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { phone, jobRole, email } = req.body;

      const user = await googleAuthFlowUseCase(dependencies).execute({
        phone,
        jobRole,
        email,
      });

      const payload = {
        id: user._id,
        email: user.email,
        username: user.username,
        role: "user" as "user",
      };
      const { accessToken, refreshToken } = Token.generateJwtToken(payload);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      res.status(201).json(user);
    } catch (error) {
      console.log(error);
    }
  };

  return googleAuth;
};

export { googleAuthController };
