import { injectable, inject } from "inversify";
import { IAuthRepository } from "@/infrastructure/interface/repository/IAuthRepository";
import { IHashService } from "@infrastructure/interface/service/IHashService";
import { ITokenService } from "@/infrastructure/interface/service/ITokenService";
import { UserWithAuthToken } from "@/shared/types/user-with-auth-token";
import { Auth } from "@/domain/entities/auth";
import { Common, Repositories, Services } from "@/di/symbols";

import { ErrorCode } from "@/shared/constance";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "@muhammednajinnprosphere/common";
import { IAuthRequestWithDevice } from "@/shared/types/auth-token";
import { TokenManager } from "@/shared/services/token-manager";

export interface IAdminLoginRequest extends IAuthRequestWithDevice {
  password: string;
}

@injectable()
export class AdminLoginUseCase {
  constructor(
    @inject(Repositories.UserRepository)
    private userRepository: IAuthRepository,
    @inject(Services.HashService) private hashService: IHashService,
    @inject(Services.TokenService) private tokenService: ITokenService,
    @inject(Common.TokenManager) private tokenManager: TokenManager
  ) {}

  /**
   * Authenticates a user by email and password, checks for admin status and block status,
   * and returns authentication tokens with user info.
   *
   * @param input - Object containing the user's email and password.
   * @returns An object with the authenticated user and their tokens.
   * @throws {NotFoundError} if the user is not found.
   * @throws {BadRequestError} if the password is invalid.
   * @throws {ForbiddenError} if the user is blocked or not an admin.
   */
  async execute({
    email,
    password,
    ipAddress,
    userAgent,
  }: IAdminLoginRequest): Promise<UserWithAuthToken> {
    const userData = await this.userRepository.findByEmail(email);

    if (!userData) {
      // Use NotFoundError for a non-existent user
      throw new NotFoundError("No Existing Acoount", "USER_NOT_FOUND");
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

    // Check if the user's role is admin before proceeding with password validation
    if (!user.isAdmin()) {
      // Throw ForbiddenError if the user is not an admin
      throw new ForbiddenError(
        "Unauthorized access: User is not an admin.",
        "ADMIN_ACCESS_REQUIRED"
      );
    }
  console.log("password", password, user.password);
    const isPasswordValid = await this.hashService.compare(
      password,
      user.password
    );
    console.log("isPasswordValid", isPasswordValid);
    if (!isPasswordValid) {
      throw new BadRequestError(
        "Invalid password",
        ErrorCode.INVALID_PASSWORD,
        "password"
      );
    }

    const { accessToken, refreshToken } = await this.tokenManager.issueTokens(
      user,
      ipAddress,
      userAgent
    );

    return { accessToken, refreshToken, user };
  }
}
