import { injectable, inject } from "inversify";
import { ICacheService } from "@/infrastructure/interface/service/ICacheService";
import { IOtpService } from "@/infrastructure/interface/service/IOtpService";
import { IMailService } from "@/infrastructure/interface/service/IMailService";
import { BadRequestError, Time } from "@muhammednajinnprosphere/common";
import { IAuth } from "@/domain/interface/IAuth";
import { Services } from "@/di/symbols";

export interface ResendOtpInput {
  email: string;
}

@injectable()
export class ResendOtpUseCase {
  constructor(
    @inject(Services.CacheService) private cacheService: ICacheService,
    @inject(Services.OtpService) private otpService: IOtpService,
    @inject(Services.MailService) private mailService: IMailService,
  ) {}

  /**
   * Resends OTP to the user's email if user data exists in cache
   */
  async execute(input: ResendOtpInput): Promise<void> {
    const { email } = input;
   console.log(`Resending OTP to email: ${email}`); 
    // Check if user data exists in cache (meaning user has initiated signup)
    const cachedUserData = await this.cacheService.get(`${email}-userdata`);
    
    if (!cachedUserData) {
      throw new BadRequestError(
        "No pending verification found for this email. Please sign up first.",
        "NO_PENDING_VERIFICATION",
        "email"
      );
    }

    // Parse user data
    const userData: IAuth = JSON.parse(cachedUserData);

    // Generate new OTP
    const newOtp = this.otpService.generate(6);

    console.log(`Generated new OTP: ${newOtp}`);
    console.log(`User data:`, userData);

    // Cache the new OTP with TTL
    const OTP_TTL_SECONDS = 5 * Time.MINUTES;
    await this.cacheService.set(`${email}-otp`, newOtp, OTP_TTL_SECONDS);

    // Send new OTP via email
    await this.mailService.sendOtpMail({
      email,
      name: userData.username,
      otp: newOtp
    });
  }
}