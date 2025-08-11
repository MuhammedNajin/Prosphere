import { injectable, inject } from "inversify";
import { IJwtUserData, ITokenService } from "@/infrastructure/interface/service/ITokenService";
import { IAuthRepository } from "@/infrastructure/interface/repository/IAuthRepository";
import { Auth } from "@/domain/entities/auth";
import { IAuthToken } from "@/shared/types/auth-token";
import { Repositories, Services } from "@/di/symbols";
import { ForbiddenError, NotFoundError, UnauthorizedError } from "@muhammednajinnprosphere/common";


@injectable()
export class AdminRefreshTokenUseCase {
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
   * @throws {ForbiddenError} if the user is not an admin or is blocked.
   */
  async execute(token: string): Promise<IAuthToken> {
    const payload = await this.tokenService.decodeRefreshToken<IJwtUserData>(token);

    if (!payload || !payload.userId) {
      // Throw UnauthorizedError for invalid or expired tokens
      throw new UnauthorizedError("Invalid or expired refresh token.", 'TOKEN_INVALID');
    }

    const userData = await this.userRepository.findById(payload.userId);

    if (!userData) {
      // Throw NotFoundError if the user doesn't exist
      throw new NotFoundError("User not found", 'USER_NOT_FOUND');
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

    // Check if the user is an admin first
    if (!user.isAdmin()) {
      // Throw ForbiddenError if the user is not an admin
      throw new ForbiddenError("Unauthorized access: User is not an admin.", 'ADMIN_ACCESS_REQUIRED');
    }
    
    // Check if the user is blocked from logging in
    if (!user.canLogin()) {
      // Throw ForbiddenError if the user is blocked
      throw new ForbiddenError("User is blocked from logging in.", 'USER_BLOCKED');
    }

    const tokenPayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role, // Use the actual user role
    };

    const newAccessToken = this.tokenService.generateAccessToken(tokenPayload);
    const newRefreshToken = this.tokenService.generateRefreshToken(tokenPayload);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
