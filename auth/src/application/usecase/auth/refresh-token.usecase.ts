import { injectable, inject } from "inversify";
import { IJwtUserData, ITokenService } from "@/infrastructure/interface/service/ITokenService";
import { IAuthRepository } from "@/infrastructure/interface/repository/IAuthRepository";
import { Auth } from "@/domain/entities/auth";
import { ROLE } from "@/shared/types/enums";
import { IAuthToken } from "@/shared/types/auth-token";
import { Repositories, Services } from "@/di/symbols";
import { ErrorCode } from "@/shared/constance";
import { ForbiddenError } from "@muhammednajinnprosphere/common";

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject(Services.TokenService) private tokenService: ITokenService,
    @inject(Repositories.UserRepository) private userRepository: IAuthRepository
  ) {}

  /**
   * Generates a new access token from a valid refresh token.
   * * @param token - The refresh token provided by the client.
   * @returns A new access token and user details.
   * @throws {UnauthorizedError} if the token is invalid or expired.
   * @throws {NotFoundError} if the user specified in the token is not found.
   * @throws {ForbiddenError} if the user is blocked and cannot log in.
   */
  async execute(token: string): Promise<IAuthToken> {
    const payload = await this.tokenService.decodeRefreshToken<IJwtUserData>(token);

    if (!payload || !payload.userId) {
      throw new ForbiddenError(
        "Invalid or expired refresh token.",
         ErrorCode.TOKEN_EXPIRED
        );
    }

    const userData = await this.userRepository.findById(payload.userId);

    if (!userData) {
      throw new ForbiddenError(
        "Invalid refresh token.",
         ErrorCode.TOKEN_INVALID
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
      isVerified: userData.isVerified,
      isBlocked: userData.isBlocked,
    });

  
    if (!user.canLogin()) {
      throw new ForbiddenError(
        "User is blocked from logging in.",
         ErrorCode.USER_BLOCKED
        );
    }

    const tokenPayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: ROLE.USER,
    };

    const newAccessToken = this.tokenService.generateAccessToken(tokenPayload);
    const newRefreshToken = this.tokenService.generateRefreshToken(tokenPayload);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}