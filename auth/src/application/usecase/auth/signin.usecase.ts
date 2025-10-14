import { injectable, inject } from "inversify";
import { IAuthRepository } from "@/infrastructure/interface/repository/IAuthRepository";
import { IHashService } from "@infrastructure/interface/service/IHashService";
import { UserWithAuthToken } from "@/shared/types/user-with-auth-token";
import { Auth } from "@/domain/entities/auth";
import { Common, Repositories, Services } from "@/di/symbols";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "@muhammednajinnprosphere/common";
import { ErrorCode } from "@/shared/constance";
import { TokenManager } from "@/shared/services/token-manager";
import { IAuthRequestWithDevice } from "@/shared/types/auth-token";

export interface ISigninParams extends IAuthRequestWithDevice {
  password: string;
}

@injectable()
export class SigninUseCase {
  constructor(
    @inject(Repositories.UserRepository)
    private userRepository: IAuthRepository,
    @inject(Services.HashService) private hashService: IHashService,
    @inject(Common.TokenManager) private tokenManager: TokenManager
  ) {}

  /**
   * Authenticates a user by email and password, checks if the user is blocked, and returns authentication tokens with user info.
   *
   * @param input - Object containing the user's email and password.
   * @returns An object with the authenticated user and their tokens.
   * @throws Error if the user is not found, password is invalid, or the user is blocked.
   */
  async execute({
    email,
    password,
    ipAddress,
    userAgent,
  }: ISigninParams): Promise<UserWithAuthToken> {
    const userData = await this.userRepository.findByEmail(email);

    if (!userData) {
      throw new NotFoundError(
        "We couldn't find an account associated with this email.",
        ErrorCode.USER_NOT_FOUND
      );
    }

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

    console.log("passwords", password, user.password);

    const isPasswordValid = await this.hashService.compare(
      password!,
      user.password!
    );

    if (!isPasswordValid) {
      throw new BadRequestError(
        "Authentication failed. Please check your password.",
        ErrorCode.INVALID_PASSWORD,
        "password"
      );
    }

    console.log("can login", user, user.role);

    if(user.isActive()) {
      throw new ForbiddenError("Your account is blocked", ErrorCode.USER_BLOCKED);
    }

    if (!user.canLogin()) {
      throw new ForbiddenError("Authentication failed. Invalid credential.", ErrorCode.USER_BLOCKED);
    }



    const { accessToken, refreshToken } = await this.tokenManager.issueTokens(
      user,
      ipAddress,
      userAgent
    );

    return { accessToken, refreshToken, user };
  }
}
