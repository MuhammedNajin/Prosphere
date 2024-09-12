import express, { NextFunction, Request, Response } from "express";
import OTP from "../../libs/utils/otp";
import { generateOTPEmail, getMessage } from "../../libs/utils/genarateMail";
import { BadRequestError } from "@muhammednajinnprosphere/common";

export const signupController = (dependencies: any) => {
  console.log("signup");
  
  const {
    useCases: {  getUserUseCase, signupUseCase, sentMailUseCase },
    repository: { otpRepository }
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
      

      const userExsist = await getUserUseCase(dependencies).execute({ email });

      console.log("userExsist",  userExsist);

      if(userExsist) {
        throw new BadRequestError("Email already exsist, try another.")
      }
       
      const user = await signupUseCase(dependencies).execute({
        username,
        email,
        password,
        phone,
        jobRole,
        location,
        companyName
      });
      
      console.log("user", user);
      
      const otp = OTP.generate(6);
      await otpRepository.saveOtp({ userId: user._id, otp });
      const mail = generateOTPEmail(email, otp, "minute");
      const message = getMessage({ userEmail: email , subject:"Verification code", mail });
      const sentotp = await sentMailUseCase(dependencies).execute(message);

      console.log(sentotp);
      res.status(201).json(user);

    } catch (error: any) {
      console.log(error);
      next(error)
    }
  };

  return createUser;
};
