import { Request, Response, NextFunction } from "express";
import { Dependencies } from "@domain/entities/interfaces";
import OTP from "@/infrastructure/libs/otp";
import { generateOTPEmail, getMessage } from "@/infrastructure/libs/genarateMail";

const resentOTPController = (dependencies: Dependencies) => {
  const {
    useCases: { sentMailUseCase,  },
    repository: { otpRepository, redisRepository}
  } = dependencies;

  const resentOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, userId } = req.body;
      console.log("resent-otp contoller: ", req.body);

      const otp = OTP.generate(6);
      await redisRepository.setOtp(otp, email);
      const mail = generateOTPEmail(email, otp, "minute");
      const message = getMessage({ userEmail: email , subject:"Verification code", mail });
      const sentotp = await sentMailUseCase(dependencies).execute(message);

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
