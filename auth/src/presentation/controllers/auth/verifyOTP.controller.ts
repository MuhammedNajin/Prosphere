import { Request, Response, NextFunction } from "express";
import { Dependencies } from "@domain/entities/interfaces";
import Token from "@infra/libs/token";
import { BadRequestError, StatusCode } from "@muhammednajinnprosphere/common";
import { OTP_ERROR_STATE, ROLE, TOKEN_TYPE } from "@/shared/types/enums";

const verifyOTPController = (dependencies: Dependencies) => {
  const {
    useCases: { verifyOtpUseCase, verifyUserUseCase, signupUseCase },
    messageBroker: { UserCreatedProducer, kafka },
    rpc: { grpcClient }
  } = dependencies;

  const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { otp, email } = req.body;
      console.log(req.body);
    
      const state = await verifyOtpUseCase(dependencies).execute({ email, otp });


      if (state === OTP_ERROR_STATE.EXPIRIED) { 
        throw new BadRequestError("Otp expired, resent otp"); 

      } else if(state === OTP_ERROR_STATE.INVALID) {
        throw new BadRequestError("Invalid otp, enter valid otp")

      }
      

      const verified = await signupUseCase(dependencies).execute(email);

      if (!verified) {
        throw new Error("Something went wrong, try again");
      }

       await new UserCreatedProducer(kafka.producer).produce({
         _id: verified._id,
         username: verified.username,
         email: verified.email,
         jobRole: verified.jobRole,
         phone: verified.phone,
         location: verified.location,
         gender: verified.gender,
       })

      const payload = {
        id: verified._id,
        username: verified.username,
        email: verified.email,
        role: ROLE.USER
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

      res
       .status(StatusCode.OK)
       .json(verified);
      
    } catch (error) {
      console.log(error);

      next(error)
    }
  };
  
  return verifyOtp;
};

export { verifyOTPController };
