import { Request, Response, NextFunction } from "express";
import { Dependencies } from "../../libs/entities/interfaces";
import Token from "../../libs/utils/token";

const verifyOTPController = (dependencies: Dependencies) => {
  const {
    useCases: { verifyOtpUseCase, verifyUserUseCase },
  } = dependencies;

  const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { otp, userId } = req.body;
      console.log(req.body);
      // change: take userId from cokiee or token
      const verifyOTP = await verifyOtpUseCase(dependencies).execute({
        userId,
        otp,
      });
      if (!verifyOTP) {
        throw new Error("otp not verified");
      }

      const verified = await verifyUserUseCase(dependencies).execute(userId);

      if (!verified) {
        throw new Error("user not verified");
      }

      const payload = {
        id: verified._id,
        username: verified.username,
        email: verified.email,
      };
      const token = Token.generateJwtToken(payload);
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      res.status(200).json({ verified: true });
      
    } catch (error) {
      console.log(error);
    }
  };

  return verifyOtp;
};

export { verifyOTPController };
