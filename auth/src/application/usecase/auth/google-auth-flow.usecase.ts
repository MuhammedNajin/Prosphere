import { injectable, inject } from "inversify";
import { IAuthRepository } from "@/infrastructure/interface/repository/IAuthRepository";
import { IAuth } from "@/domain/interface/IAuth";
import { ICacheService } from "@/infrastructure/interface/service/ICacheService";
import { ITokenService } from "@/infrastructure/interface/service/ITokenService";
import { Common, MessageBrokers, Repositories, Services } from "@/di/symbols";
import { BadRequestError } from "@muhammednajinnprosphere/common";
import { ErrorCode } from "@/shared/constance";
import { IAuthRequestWithDevice } from "@/shared/types/auth-token";
import { TokenManager } from "@/shared/services/token-manager";
import { UserWithAuthToken } from "@/shared/types/user-with-auth-token";
import { UserCreatedProducer } from "@/infrastructure/MessageBroker/kafka/producer/user-created-producer";


export interface IGoogleAuthFlowParams extends IAuthRequestWithDevice {
  phone: string;
  username: string;
}

@injectable()
export class GoogleAuthFlowUseCase {
  constructor(
    @inject(Repositories.UserRepository) private userRepository: IAuthRepository,
    @inject(Services.CacheService) private cacheService: ICacheService,
    @inject(Services.TokenService) private tokenService: ITokenService,
    @inject(Common.TokenManager) private tokenManager: TokenManager,
    @inject(MessageBrokers.UserCreatedProducer) private userCreatedProducer: UserCreatedProducer,
  ) {
    if (!userRepository) {
      throw new Error("GoogleAuthFlowUseCase initialization error: 'userRepository' dependency is required but was not provided.");
    }
  }

  async execute({ phone, email, username, ipAddress, userAgent }: IGoogleAuthFlowParams): Promise<UserWithAuthToken> {
    console.log("google-auth-flow", phone, email, username)
    const cachedUserData = await this.cacheService.get(`${email}-google`);
    
    console.log("cachedUserdata", cachedUserData  )
    if (!cachedUserData) {
      throw new BadRequestError(
        "Please authenticate with Google first.",
        ErrorCode.GOOGLE_AUTH_DATA_MISSING,
      )
    }

    // Check for duplicate username
    const existingUserByUsername = await this.userRepository.findByUsername(username);
    if (existingUserByUsername) {
       throw new BadRequestError(
           'This username is already taken. Please choose another one.',
           ErrorCode.USERNAME_ALREADY_EXISTS,
            'username'
          ) 
    }

    // Check for duplicate phone number
    const existingUserByPhone = await this.userRepository.findByPhone(phone);
     if(existingUserByPhone) {
      throw new BadRequestError(
        'Phone number is already registered. Please use a different phone number.',
        ErrorCode.PHONE_ALREADY_EXISTS,
        'phone'
      );
    }

    // Parse cached user data and create complete user object
    const userData = JSON.parse(cachedUserData);
    const password = await this.tokenService.generateToken();
    
    const completeUserData: Partial<IAuth> = {
      ...userData,
      username,
      phone,
      email,
      password
    };

    // Create new user
    const newUser = await this.userRepository.create(completeUserData as IAuth);
    
    // Clean up cache after successful user creation
    await this.cacheService.del(`${email}-google`);

    console.log("newUser", newUser);

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

    console.log("user produced sccessfully")

     const { accessToken, refreshToken  } = await this.tokenManager.issueTokens(newUser, ipAddress, userAgent);

    return {
      user: newUser,
      accessToken,
      refreshToken
    };
  }
}