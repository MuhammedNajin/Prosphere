import { OTP } from "../../database";
import { IOtp } from "@domain/entities/interfaces";

export default {
  async saveOtp({ otp, userId }: IOtp) {
    console.log();
    try {
      const otpExsist = await OTP.findOne({ userId: userId });
      console.log(otpExsist)
      if (otpExsist) {
       await otpExsist.deleteOne();
      }
      const now = Date.now();
      const mongooseObject = new OTP({ otp, userId, expiresAt: now + ( 60 * 60 * 1000 )  });

      console.log("mongooseObject,", mongooseObject);

      return await mongooseObject.save();
    } catch (error) {
      console.log(error);
    }
  },

  async verifyOtp({ otp, userId }: IOtp) {
    const now = Date.now();
    const existingOtp = await OTP.findOne({
      userId: userId,
      expiresAt: { $gt: now }
    });
    console.log(existingOtp);

    if (!existingOtp) {
       return { message: "expired"}
    }


    if (otp === existingOtp.otp) {
      await existingOtp.deleteOne();
      return true;
    }

    // Delete the used OTP for security
    return {message: "invalid" }
  },
};
