import { injectable, inject } from "inversify";
import {
  IJWTClaimWithUser,
  ITokenService,
} from "@/infrastructure/interface/service/ITokenService";
import { IAuthRepository } from "@/infrastructure/interface/repository/IAuthRepository";
import { Auth } from "@/domain/entities/auth";
import { IAuthToken } from "@/shared/types/auth-token";
import { Common, Repositories, Services } from "@/di/symbols";
import { ErrorCode } from "@/shared/constance";
import {
  ForbiddenError,
  UnauthorizedError,
  NotFoundError,
} from "@muhammednajinnprosphere/common";
import { IRefreshToken } from "@/domain/interface/IRefreshToken";
import {
  
  TokenManager,
} from "@/shared/services/token-manager";
import { IRefreshTokenRepository } from "@/infrastructure/interface/repository/IRefreshTokenRepository";
import { RefreshToken } from "@/domain/entities/refresh-token";
import { IHashService } from "@/infrastructure/interface/service/IHashService";

interface RefreshTokenParams {
  refreshToken: string;
  ipAddress: string;
  userAgent: string;
}
@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject(Services.TokenService) private readonly tokenService: ITokenService,
    @inject(Repositories.UserRepository)
    private readonly userRepository: IAuthRepository,
    @inject(Repositories.RefreshTokenRepository)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @inject(Common.TokenManager) private readonly tokenManager: TokenManager,
    @inject(Services.HashService) private readonly hashService: IHashService,
  ) {}

  /**
   * Generates a new access token from a valid refresh token.
   * @param token - The refresh token provided by the client.
   * @param ipAddress - The client's IP address for security tracking.
   * @param userAgent - The client's user agent for device tracking.
   * @returns A new access token and refresh token pair.
   * @throws {UnauthorizedError} if the token is invalid or expired.
   * @throws {NotFoundError} if the user or refresh token is not found.
   * @throws {ForbiddenError} if the user is blocked or token is revoked.
   */
  async execute({ ipAddress, refreshToken, userAgent}: RefreshTokenParams): Promise<IAuthToken> {
    // Step 1: Decode and validate the refresh token
    const { user: refreshTokenPayload} = await this.validateRefreshToken(refreshToken);

    // Step 2: Retrieve and validate the refresh token from database
    const refreshTokenDto = await this.getRefreshTokenFromDatabase(
      refreshTokenPayload.tokenId
    );

    console.log("refrshTokenDto", refreshTokenDto)

    await this.compareToken(refreshTokenDto.token, refreshToken);

    // Step 3: Create domain entity and validate token state
    const refreshTokenDomain = this.createRefreshTokenDomain(
      refreshTokenDto,
      refreshToken
    );
    this.validateTokenState(refreshTokenDomain);

    // Step 4: Retrieve and validate the user
    const userData = await this.getUserData(refreshTokenPayload.userId);

    console.log("userData----->>>>>>>>", userData)
    const userDomain = this.createUserDomain(userData);
    this.validateUserCanLogin(userDomain);

    // Step 5: Update token usage tracking
    await this.updateTokenUsage(refreshTokenPayload.tokenId);

    // Step 6: Issue new token pair
    const newTokens = await this.tokenManager.issueTokens(
      userDomain,
      ipAddress,
      userAgent
    );

    // Step 7: Optionally revoke the old refresh token (implement token rotation)
    await this.revokeOldToken(refreshTokenPayload.tokenId);

    return {
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
    };
  }

  /**
   * Validates and decodes the refresh token payload.
   */
  private async validateRefreshToken(
    token: string
  ): Promise<IJWTClaimWithUser> {
      const payload = await this.tokenService.decodeRefreshToken<IJWTClaimWithUser>(token);
     console.log(payload);

      if (!payload || !payload.user || !payload.user.tokenId) {
        throw new UnauthorizedError(
          "Invalid refresh token format.",
          ErrorCode.TOKEN_INVALID
        );
      }

      return payload;
  }

  /**
   * Retrieves refresh token data from the database.
   */
  private async getRefreshTokenFromDatabase(
    tokenId: string
  ): Promise<IRefreshToken> {
    const refreshTokenDto = await this.refreshTokenRepository.findById(tokenId);
    console.log("refreshTokenDto", refreshTokenDto)
    if (!refreshTokenDto) {
      throw new NotFoundError(
        "Refresh token not found.",
        ErrorCode.TOKEN_NOT_FOUND
      );
    }

    return refreshTokenDto;
  }

  /**
   * Creates refresh token domain entity from DTO.
   */
  private createRefreshTokenDomain(
    refreshTokenDto: IRefreshToken,
    token: string
  ): RefreshToken {
    return RefreshToken.fromPersistence(
      refreshTokenDto.id!,
      refreshTokenDto.userId,
      token, // Use the actual token, not the stored hash
      refreshTokenDto.expiresAt,
      refreshTokenDto.isRevoked,
      refreshTokenDto.deviceInfo,
      refreshTokenDto.ipAddress,
      refreshTokenDto.createdAt,
      refreshTokenDto.lastUsedAt,
      refreshTokenDto.updatedAt
    );
  }

  /**
   * Validates the refresh token state.
   */
  private validateTokenState(refreshTokenDomain: RefreshToken): void {
    if (!refreshTokenDomain.isValid()) {
      if (refreshTokenDomain.isRevokedStatus()) {
        throw new ForbiddenError(
          "Refresh token has been revoked.",
          ErrorCode.TOKEN_REVOKED
        );
      }

      if (refreshTokenDomain.isExpired()) {
        throw new UnauthorizedError(
          "Refresh token has expired.",
          ErrorCode.TOKEN_EXPIRED
        );
      }

      throw new UnauthorizedError(
        "Refresh token is invalid.",
        ErrorCode.TOKEN_INVALID
      );
    }
  }

  /**
   * Retrieves user data from the database.
   */
  private async getUserData(userId: string): Promise<any> {
    const userData = await this.userRepository.findById(userId);

    if (!userData) {
      throw new NotFoundError(
        "User associated with refresh token not found.",
        ErrorCode.USER_NOT_FOUND
      );
    }

    return userData;
  }

  /**
   * Creates user domain entity from user data.
   */
  private createUserDomain(userData: any): Auth {
    return Auth.create({
      id: userData.id,
      username: userData.username,
      email: userData.email,
      password: userData.password ?? '',
      phone: userData.phone,
      role: userData.role,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
      isVerified: userData.isVerified,
      isBlocked: userData.isBlocked,
    });
  }

  private async compareToken(tokenFromDb: string, refreshToken: string) {
    console.log("compareToken", tokenFromDb, refreshToken)
     const isSame = await this.hashService.compare(refreshToken, tokenFromDb)

     if(!isSame) {
         throw new UnauthorizedError(
        "Refresh token is invalid.",
        ErrorCode.TOKEN_INVALID
      );
     }
  }

  /**
   * Validates that the user can login.
   */
  private validateUserCanLogin(userDomain: Auth): void {
    if (!userDomain.canLogin()) {
      throw new ForbiddenError(
        "User account is blocked or inactive.",
        ErrorCode.USER_BLOCKED
      );
    }
  }

  /**
   * Updates the token's last used timestamp.
   */
  private async updateTokenUsage(tokenId: string): Promise<void> {
    try {
      await this.refreshTokenRepository.updateLastUsed(tokenId);
    } catch (error) {
      // Log the error but don't fail the request
      console.warn(
        `Failed to update token usage for tokenId: ${tokenId}`,
        error
      );
    }
  }

  /**
   * Revokes the old refresh token (token rotation strategy).
   * This is optional but recommended for better security.
   */
  private async revokeOldToken(tokenId: string): Promise<void> {
    try {
      await this.refreshTokenRepository.revokeByTokenId(tokenId);
    } catch (error) {
      // Log the error but don't fail the request
      console.warn(`Failed to revoke old token: ${tokenId}`, error);
    }
  }
}
