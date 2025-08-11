import { injectable, inject } from "inversify";
import { ROLE } from "@/shared/types/enums";
import { UserWithAuthToken } from "@/shared/types/user-with-auth-token";
import { IAuth } from "@/domain/interface/IAuth";
import { ICacheService } from "@/infrastructure/interface/service/ICacheService";
import { ITokenService } from "@/infrastructure/interface/service/ITokenService";
import { IAuthRepository } from "@/infrastructure/interface/repository/IAuthRepository";
import { UserCreatedProducer } from "@/infrastructure/MessageBroker/kafka/producer/user-created-producer";
import { Auth } from "@/domain/entities/auth";
import { MessageBrokers, Repositories, Services } from "@/di/symbols";

interface VerifyOtpUseCaseInput {
  otpFromUser: string;
  email: string;
}

@injectable()
export class VerifyOtpUseCase {
  constructor(
    @inject(Services.CacheService) private cacheService: ICacheService,
    @inject(Services.TokenService) private tokenService: ITokenService,
    @inject(Repositories.UserRepository) private userRepository: IAuthRepository,
    @inject(MessageBrokers.UserCreatedProducer) private userCreatedProducer: UserCreatedProducer
  ) {}

  /**
   * Verifies the OTP for a user, persists the user if OTP is valid, generates tokens, and emits a user created event.
   *
   * @param input - Object containing the OTP provided by the user and their email address.
   * @returns An object containing the newly created user and their authentication tokens.
   * @throws Error if OTP is expired/invalid or cached user data is missing.
   */
  public async execute({ otpFromUser, email }: VerifyOtpUseCaseInput): Promise<UserWithAuthToken> {
    // Get OTP from cache
    const cachedOtp = await this.cacheService.get(`${email}-otp`);
    if (!cachedOtp) {
      throw new Error("OTP expired or not found");
    }

    // Get cached user data from cache
    const cachedUserData = await this.cacheService.get(`${email}-userdata`);
    if (!cachedUserData) {
      throw new Error("Internal error: Cached user data missing");
    }

    const userData: IAuth = JSON.parse(cachedUserData);

    // Reconstruct domain User entity
    const user = Auth.create({
          id: userData.id,
          username: userData.username,
          email: userData.email,
          phone: userData.phone,
          role: userData.role,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
          password: userData.password,
          isVerified: userData.isVerified,
          isBlocked: userData.isBlocked,
        });

    // Verify OTP
    if (!user.isOtpValid(cachedOtp, otpFromUser)) {
      throw new Error("Invalid OTP");
    }

    user.verify();

    // Remove cached data after verification
    await Promise.all([
      this.cacheService.del(`${email}-otp`),
      this.cacheService.del(`${email}-userdata`)
    ]);

    // Persist user in database
    const newUser = await this.userRepository.create(user);

    // Generate tokens
    const tokenPayload = {
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: ROLE.USER,
    };

    const accessToken = this.tokenService.generateAccessToken(tokenPayload);
    const refreshToken = this.tokenService.generateRefreshToken(tokenPayload);

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
      refreshToken,
    };
  }
}
