import { injectable, inject } from "inversify";
import { IAuth } from "@/domain/interface/IAuth";
import { ICacheService } from "@/infrastructure/interface/service/ICacheService";
import { IAuthRepository } from "@/infrastructure/interface/repository/IAuthRepository";
import { UserCreatedProducer } from "@/infrastructure/MessageBroker/kafka/producer/user-created-producer";
import { Auth } from "@/domain/entities/auth";
import { Common, MessageBrokers, Repositories, Services } from "@/di/symbols";
import { BadRequestError } from "@muhammednajinnprosphere/common";
import { ErrorCode } from "@/shared/constance";
import { TokenManager } from "@/shared/services/token-manager";
import { UserWithAuthToken } from "@/shared/types/user-with-auth-token";
import { IAuthRequestWithDevice } from "@/shared/types/auth-token";

export interface IVerifyOtpParams extends IAuthRequestWithDevice {
  otpFromUser: string;
}


@injectable()
export class VerifyOtpUseCase {
  constructor(
    @inject(Services.CacheService) private cacheService: ICacheService,
    @inject(Repositories.UserRepository) private userRepository: IAuthRepository,
    @inject(MessageBrokers.UserCreatedProducer) private userCreatedProducer: UserCreatedProducer,
    @inject(Common.TokenManager) private tokenManager: TokenManager
  ) {


  }

  public async execute({ 
    otpFromUser, 
    email, 
    ipAddress = '127.0.0.1', 
    userAgent 
  }: IVerifyOtpParams): Promise<UserWithAuthToken> {
    console.log(`Starting OTP verification for email: ${email}`);

    // Get OTP from cache
    const cachedOtp = await this.cacheService.get(`${email}-otp`);
    if (!cachedOtp) {
      throw new BadRequestError(
        "OTP expired or not found. Please request a new OTP.",
        ErrorCode.OTP_EXPIRED,
        'otp'
      );
    }

    // Get cached user data from cache
    const cachedUserData = await this.cacheService.get(`${email}-userdata`);
    if (!cachedUserData) {
      throw new BadRequestError(
        "Session expired. Please sign up again.",
        ErrorCode.SESSION_EXPIRED,
        'session'
      );
    }

    const userData: IAuth = JSON.parse(cachedUserData);

    // Verify OTP first
    if (cachedOtp !== otpFromUser) {
      throw new BadRequestError(
        "Invalid OTP. Please check and try again.",
        ErrorCode.INVALID_OTP,
        'otp'
      );
    }

    console.log('OTP verification successful');

    // Reconstruct domain User entity
    const user = Auth.create({
      id: userData.id,
      username: userData.username,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      provider: userData.provider,
      role: userData.role,
      isVerified: false,
      isBlocked: userData.isBlocked || false,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    });

    user.verify();

    await Promise.all([
      this.cacheService.del(`${email}-otp`),
      this.cacheService.del(`${email}-userdata`)
    ]);

    let newUser: IAuth;
    try {
      newUser = await this.userRepository.create(user.toObject());
      console.log('User successfully created in database:', newUser.id);
    } catch (dbError) {
      console.error('Database error during user creation:', dbError);
      
      if (dbError instanceof Error) {
        if (dbError.message.includes('duplicate key') || dbError.message.includes('E11000')) {
          throw new BadRequestError(
            "User already exists with this email or username.",
            ErrorCode.USER_ALREADY_EXISTS,
            'user'
          );
        } else if (dbError.message.includes('validation')) {
          throw new BadRequestError(
            "Invalid user data format. Please try again.",
            ErrorCode.VALIDATION_ERROR,
            'user'
          );
        }
      }
      
      throw new Error("Failed to create user account. Please try again.");
    }

    const { accessToken, refreshToken  } = await this.tokenManager.issueTokens(user, ipAddress, userAgent);
    console.log('Refresh token stored in database');

    // Send user created event
    await this.userCreatedProducer.produce({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      isVerified: newUser.isVerified,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    });

    return {
      user: newUser,
      accessToken,
      refreshToken
    };
  }
}