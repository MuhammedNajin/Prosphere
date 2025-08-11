import { injectable, inject } from "inversify";
import { IAuthRepository } from "@/infrastructure/interface/repository/IAuthRepository";
import { IAuth } from "@/domain/interface/IAuth";
import { ICacheService } from "@/infrastructure/interface/service/ICacheService";
import { ITokenService } from "@/infrastructure/interface/service/ITokenService";
import { ROLE } from "@/shared/types/enums";
import { Repositories, Services } from "@/di/symbols";
import { BadRequestError } from "@muhammednajinnprosphere/common";
import { ErrorCode } from "@/shared/constance";

@injectable()
export class GoogleAuthFlowUseCase {
  constructor(
    @inject(Repositories.UserRepository) private userRepository: IAuthRepository,
    @inject(Services.CacheService) private cacheService: ICacheService,
    @inject(Services.TokenService) private tokenService: ITokenService
  ) {
    if (!userRepository) {
      throw new Error("GoogleAuthFlowUseCase initialization error: 'userRepository' dependency is required but was not provided.");
    }
  }

  async execute({ phone, email }: Pick<IAuth, "email" | "phone">): Promise<{ user: IAuth; accessToken: string; refreshToken: string }> {
    const cachedUserData = await this.cacheService.get(`${email}-google`);
    
    if (!cachedUserData) {
      throw new BadRequestError(
        "Please authenticate with Google first.",
        ErrorCode.GOOGLE_AUTH_DATA_MISSING,
      )
    }

    const userData = JSON.parse(cachedUserData);
    const password = await this.tokenService.generateToken()
    const completeUserData: Partial<IAuth> = {
      ...userData,
      phone,
      location,
      email,
      password
    };

    const newUser = await this.userRepository.create(completeUserData as IAuth);
    await this.cacheService.del(`${email}-google`);

    const tokenPayload = {
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: ROLE.USER, 
    };

    const accessToken = this.tokenService.generateAccessToken(tokenPayload);
    const refreshToken = this.tokenService.generateRefreshToken(tokenPayload);

    return {
      user: newUser,
      accessToken,
      refreshToken,
    };
  }
}