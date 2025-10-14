import { injectable, inject } from "inversify";
import { IAuthRepository } from "@/infrastructure/interface/repository/IAuthRepository";
import { IHashService } from "@/infrastructure/interface/service/IHashService";
import { ICacheService } from "@/infrastructure/interface/service/ICacheService";
import { IOtpService } from "@/infrastructure/interface/service/IOtpService";
import { BadRequestError, Time } from "@muhammednajinnprosphere/common";
import { IAuth } from "@/domain/interface/IAuth";
import { AuthProvider, ErrorCode, UserRole } from "@/shared/constance";
import { IMailService } from "@/infrastructure/interface/service/IMailService";
import { Repositories, Services } from "@/di/symbols";

export interface SignupInput extends Pick<IAuth, 'email' | 'username' | 'password' | 'phone'> { 
}
@injectable()
export class SignupUseCase {
  constructor(
    @inject(Repositories.UserRepository) private userRepository: IAuthRepository,
    @inject(Services.MailService) private mailService: IMailService,
    @inject(Services.HashService) private hashService: IHashService,
    @inject(Services.CacheService) private cacheService: ICacheService,
    @inject(Services.OtpService) private otpService: IOtpService,
  ) {}

  /**
   * Executes the standard user signup process with email and password.
   * This does not immediately persist the user — instead, caches the data
   * and sends an OTP to verify.
   */
  async execute(input: SignupInput): Promise<void> {
    const { email, username, password, phone } = input;

    // Check for duplicates
    const [emailExists, usernameExists, phoneExists] = await Promise.all([
      this.userRepository.findByEmail(email),
      this.userRepository.findByUsername(username),
      this.userRepository.findByPhone(phone),
    ]);

    if(phoneExists) {
      throw new BadRequestError(
        'Phone number is already registered. Please use a different phone number.',
        ErrorCode.PHONE_ALREADY_EXISTS,
        'phone'
      );
    }

    if (emailExists) {
      throw new BadRequestError(
           'An account with this email already exists.',
           ErrorCode.EMAIL_ALREADY_EXISTS,
            'email'
          )
    }

    if (usernameExists) {
       throw new BadRequestError(
           'This username is already taken. Please choose another one.',
           ErrorCode.USERNAME_ALREADY_EXISTS,
            'username'
          ) 
    }

    
    

    // Generate OTP
    const otp = this.otpService.generate(6);

    const id: string = this.userRepository.generateId()
    const userData: IAuth = {
      id,
      email,
      username,
      phone,
      password,
      provider: AuthProvider.DEFAULT,
      role: UserRole.USER,
      isVerified: false,
      isBlocked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Cache OTP and user data
    const OTP_TTL_SECONDS = 5 * Time.MINUTES;
    const USERDATA_TTL_SECONDS = 10 * Time.MINUTES;

    await Promise.all([
      this.cacheService.set(`${email}-otp`, otp, OTP_TTL_SECONDS),
      this.cacheService.set(`${email}-userdata`, JSON.stringify(userData), USERDATA_TTL_SECONDS),
    ]);

    // Send OTP
    await this.mailService.sendOtpMail({
      email,
      name: username,
      otp
    });
  }
}
