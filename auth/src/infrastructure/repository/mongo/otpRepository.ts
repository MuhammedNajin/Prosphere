import { injectable } from "inversify";
import { IOtp } from "@domain/entities/interfaces";
import { OTP } from "../../database";
import { BadRequestError } from "@muhammednajinnprosphere/common";

@injectable()
export class OtpRepository {
  async saveOtp({ otp, userId }: IOtp): Promise<IOtp> {
    const existingOtp = await OTP.findOne({ userId });
    console.log("Existing OTP:", existingOtp);

    if (existingOtp) {
      await existingOtp.deleteOne();
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour
    const mongooseObject = new OTP({ otp, userId, expiresAt });
    console.log("New OTP object:", mongooseObject);

    try {
      return await mongooseObject.save();
    } catch (error) {
      console.error("Error saving OTP:", error);
      throw new BadRequestError("Failed to save OTP");
    }
  }

  async verifyOtp({ otp, userId }: IOtp): Promise<{ message: string } | true> {
    const now = new Date();
    const existingOtp = await OTP.findOne({
      userId: userId,
      expiresAt: { $gt: now },
    });
    console.log("Existing OTP:", existingOtp);

    if (!existingOtp) {
      return { message: "expired" };
    }

    if (otp === existingOtp.otp) {
      await existingOtp.deleteOne();
      return true;
    }

    return { message: "invalid" };
  }
}