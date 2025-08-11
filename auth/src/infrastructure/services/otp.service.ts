import { injectable } from "inversify";
import otpGenerator from "otp-generator";
import { IOtpService } from "../interface/service/IOtpService";

@injectable()
export class OtpService implements IOtpService {
  constructor() {}

  generate(length: number): string {
    if (!Number.isInteger(length) || length <= 0) {
      console.error(`Invalid OTP length provided: ${length}`);
      throw new Error("OTP length must be a positive integer");
    }

    try {
      const otp = otpGenerator.generate(length, {
        upperCaseAlphabets: false,
        specialChars: false,
        digits: true,
        lowerCaseAlphabets: false,
      });
      return otp;
    } catch (error) {
      console.error("OTP generation failed:", error);
      throw new Error("Failed to generate OTP");
    }
  }
}