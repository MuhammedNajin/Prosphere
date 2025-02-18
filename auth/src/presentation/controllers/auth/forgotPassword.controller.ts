import { Request, Response, NextFunction } from "express";
import { Dependencies } from "@domain/entities/interfaces";
import {
  generatePasswordResetEmail,
  getMessage,
} from "@infra/libs/genarateMail";

const forgotPasswordController = (dependencies: Dependencies) => {
  const {
    useCases: { sentMailUseCase, forgetPasswordUseCase },
  } = dependencies;

  const forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;
      console.log("resent-otp contoller: ", req.body);

      const { user, token } = await forgetPasswordUseCase(dependencies).execute(
        email
      );
      console.log(user, token);
      if (!user) {
        throw new Error("user not exist");
      }

      
      const mail = generatePasswordResetEmail(
        email,
        `${process.env.URL as string}/reset-password/${token}?email=${email}`
      );

      const message = getMessage({
        userEmail: email,
        subject: "Rest your password",
        mail,
      });

      const forgetPass = await sentMailUseCase(dependencies).execute(message);
      console.log(forgetPass);

      res.status(201).json({
        status: "success",
        message: "Token  sent to email",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return forgotPassword;
};

export { forgotPasswordController };
