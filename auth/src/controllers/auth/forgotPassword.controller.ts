import { Request, Response, NextFunction } from "express";
import { Dependencies } from "../../libs/entities/interfaces";
import {
  generatePasswordResetEmail,
  getMessage,
} from "../../libs/utils/genarateMail";

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
      const { email, userId } = req.body;
      console.log("resent-otp contoller: ", req.body);

      const { user, token } = await forgetPasswordUseCase(dependencies).execute(
        email
      );

      if (!user) {
        throw new Error("token not stored in db");
      }

      
      const mail = generatePasswordResetEmail(
        email,
        `${process.env.URL as string}/forget-password/${token}`
      );

      const message = getMessage({
        userEmail: email,
        subject: "Rest your password",
        mail,
      });

      const sentotp = await sentMailUseCase(dependencies).execute(message);
      console.log(sentotp);

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
