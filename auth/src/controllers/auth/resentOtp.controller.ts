import { Request, Response, NextFunction } from "express";
import { Dependencies } from "../../libs/entities/interfaces";

const resentOTPController = (dependencies: Dependencies) => {
  const {
    useCases: { sentMailUseCase },
  } = dependencies;

  const resentOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, userId } = req.body;
      console.log("resent-otp contoller: ", req.body);

      const sentotp = await sentMailUseCase(dependencies).execute(
        { to: email, subject: "OTP verification", userId: userId },
        true
      );

      console.log(sentotp);

      res.status(201).json({
        status: "success",
        message: "OTP has been sent to your email",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return resentOtp;
};

export { resentOTPController };
