import express, { NextFunction, Request, Response } from "express";
import OTP from "@/infrastructure/libs/otp";
import { generateOTPEmail, getMessage } from "@/infrastructure/libs/genarateMail";
import { BadRequestError } from "@muhammednajinnprosphere/common";

export const signupController = (dependencies: any) => {
  console.log("signup");
  
  const {
    useCases: {  getUserUseCase, signupUseCase, sentMailUseCase },
    repository: { otpRepository, redisRepository }
  } = dependencies;
  
  
  const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {
        username,
        email,
        password,
        phone,
        jobRole,
        location,
        companyName,
      } = req.body;

      console.log("signup create ", req.body);
      

      const userExsist = await getUserUseCase(dependencies).execute({ email, phone });

      console.log("userExsist",  userExsist);

      if(userExsist) {
        throw new BadRequestError("Email already exsist, try another.")
      }

      await redisRepository.setUser(email, req.body);

      const otp = OTP.generate(6);
      console.log("otp", otp)
      await redisRepository.setOtp(otp, email);

      const mail = generateOTPEmail(email, otp, "minute");
      

      const message = getMessage({ userEmail: email , subject: "Verification code", mail });

      const sentotp = await sentMailUseCase(dependencies).execute(message);

      console.log(sentotp);

      res.status(201).json({ email });

    } catch (error: any) {
      console.log(error);
      next(error)
    }
  };

  return createUser;
};
