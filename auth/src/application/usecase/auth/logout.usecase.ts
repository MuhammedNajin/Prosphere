import { injectable, inject } from "inversify";
import { ITokenService } from "@/infrastructure/interface/service/ITokenService";
import { IRefreshTokenRepository } from "@/infrastructure/interface/repository/IRefreshTokenRepository";
import { Repositories, Services } from "@/di/symbols";
import { BadRequestError, UnauthorizedError, AppError, HttpStatusCode } from "@muhammednajinnprosphere/common";
import { ErrorCode } from "@/shared/constance";
import { RefreshTokenPayload } from "@/shared/services/token-manager";
import { RefreshToken } from "@/domain/entities/refresh-token";

interface LogoutUseCaseInput {
  userId: string;
  refreshToken?: string;
  logoutAll?: boolean;
  deviceInfo?: string; // Optional: for more specific device logout
}

interface LogoutResponse {
  success: boolean;
  message: string;
  loggedOutDevices?: number;
  deviceDescription?: string;
}

@injectable()
export class LogoutUseCase {
  constructor(
    @inject(Repositories.RefreshTokenRepository)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @inject(Services.TokenService)
    private readonly tokenService: ITokenService,
  ) {}

  /**
   * Handles user logout with support for single device or all devices logout.
   * @param input - Logout parameters including userId, refreshToken, and logoutAll flag
   * @returns Logout response with success status and details
   * @throws {BadRequestError} if neither refreshToken nor logoutAll is provided
   * @throws {UnauthorizedError} if the refresh token is invalid
   * @throws {AppError} if the logout process fails unexpectedly
   */
  async execute({
    userId,
    refreshToken,
    logoutAll = false,
    deviceInfo
  }: LogoutUseCaseInput): Promise<LogoutResponse> {
    console.log(`Starting logout process for user: ${userId}, logoutAll: ${logoutAll}`);

    this.validateInput({ userId, refreshToken, logoutAll });

    if (logoutAll) {
      return await this.handleLogoutFromAllDevices(userId);
    } else if (refreshToken) {
      return await this.handleLogoutFromCurrentDevice(refreshToken, userId, deviceInfo);
    }

    // This should never be reached due to input validation, but adding for completeness
    throw new BadRequestError(
      "Invalid logout parameters provided",
      ErrorCode.VALIDATION_ERROR
    );
  }

  /**
   * Validates the input parameters for the logout operation.
   */
  private validateInput({ userId, refreshToken, logoutAll }: LogoutUseCaseInput): void {
    if (!userId) {
      throw new BadRequestError(
        "User ID is required for logout",
        ErrorCode.VALIDATION_ERROR
      );
    }

    if (!logoutAll && !refreshToken) {
      throw new BadRequestError(
        "Either provide a refresh token or set logoutAll to true",
        ErrorCode.VALIDATION_ERROR
      );
    }
  }

  /**
   * Handles logout from all devices by revoking all user's refresh tokens.
   */
  private async handleLogoutFromAllDevices(userId: string): Promise<LogoutResponse> {
    console.log(`Attempting to revoke all tokens for user: ${userId}`);

    const revokedCount = await this.refreshTokenRepository.revokeAllForUser(userId);
    console.log(`Successfully revoked ${revokedCount} tokens for user ${userId}`);

    return {
      success: true,
      message: this.getLogoutAllMessage(revokedCount),
      loggedOutDevices: revokedCount
    };
  }

  /**
   * Handles logout from current device by revoking a specific refresh token.
   */
  private async handleLogoutFromCurrentDevice(
    refreshToken: string,
    userId: string,
    deviceInfo?: string
  ): Promise<LogoutResponse> {
    // Step 1: Decode and validate the refresh token
    const tokenPayload = await this.validateAndDecodeRefreshToken(refreshToken, userId);

    // Step 2: Retrieve token from database to get device info
    const refreshTokenDto = await this.refreshTokenRepository.findById(tokenPayload.tokenId);
    let deviceDescription = 'this device';

    if (refreshTokenDto) {
      const refreshTokenDomain = RefreshToken.fromPersistence(
        refreshTokenDto.id!,
        refreshTokenDto.userId,
        refreshToken,
        refreshTokenDto.expiresAt,
        refreshTokenDto.isRevoked,
        refreshTokenDto.deviceInfo,
        refreshTokenDto.ipAddress,
        refreshTokenDto.createdAt,
        refreshTokenDto.lastUsedAt,
        refreshTokenDto.updatedAt
      );

      deviceDescription = refreshTokenDomain.getSessionDescription();
    }

    // Step 3: Revoke the specific token
    const revokedToken = await this.refreshTokenRepository.revokeByTokenId(tokenPayload.tokenId);

    if (!revokedToken) {
      console.log(`Token ${tokenPayload.tokenId} not found or already revoked for user ${userId}`);
      return {
        success: false,
        message: 'Session not found or already expired',
        deviceDescription
      };
    }

    console.log(`Successfully revoked token ${tokenPayload.tokenId} for user ${userId}`);
    return {
      success: true,
      message: 'Successfully logged out from this device',
      loggedOutDevices: 1,
      deviceDescription
    };
  }

  /**
   * Validates and decodes the refresh token to extract the payload.
   */
  private async validateAndDecodeRefreshToken(refreshToken: string, userId: string): Promise<RefreshTokenPayload> {
    try {
      const tokenPayload = await this.tokenService.decodeRefreshToken<RefreshTokenPayload>(refreshToken);

      if (!tokenPayload || !tokenPayload.tokenId || !tokenPayload.userId) {
        throw new UnauthorizedError(
          "Invalid refresh token format",
          ErrorCode.TOKEN_INVALID
        );
      }

      // Ensure the token belongs to the requesting user
      if (tokenPayload.userId !== userId) {
        throw new UnauthorizedError(
          "Refresh token does not belong to the specified user",
          ErrorCode.TOKEN_INVALID
        );
      }

      return tokenPayload;
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error;
      }

      throw new UnauthorizedError(
        "Invalid or expired refresh token",
        ErrorCode.TOKEN_EXPIRED
      );
    }
  }

  /**
   * Generates appropriate message for logout from all devices.
   */
  private getLogoutAllMessage(revokedCount: number): string {
    if (revokedCount === 0) {
      return 'No active sessions found to logout';
    } else if (revokedCount === 1) {
      return 'Successfully logged out from 1 device';
    } else {
      return `Successfully logged out from ${revokedCount} devices`;
    }
  }

  /**
   * Handles errors that occur during the logout process.
   */
  private handleLogoutError(error: any, userId: string): never {
    console.error(`Logout error for user ${userId}:`, error);

    // Re-throw known errors
    if (error instanceof BadRequestError ||
        error instanceof UnauthorizedError) {
      throw error;
    }

    // Wrap unknown errors
    throw new AppError(
      "An unexpected error occurred during logout. Please try again.",
      HttpStatusCode.INTERNAL_SERVER
    );
  }

  /**
   * Optional: Method to logout from specific device by device info
   * This can be useful for user session management interfaces
   */
  async logoutFromSpecificDevice(userId: string, userAgent: string, ipAddress?: string): Promise<LogoutResponse> {
    console.log(`Attempting to logout specific device for user: ${userId}`);

    try {
      const refreshTokenDto = await this.refreshTokenRepository.findByUserIdAndDevice(userId, userAgent);

      if (!refreshTokenDto) {
        return {
          success: false,
          message: 'No matching device session found'
        };
      }

      const refreshTokenDomain = RefreshToken.fromPersistence(
        refreshTokenDto.id!,
        refreshTokenDto.userId,
        '', // We don't have the actual token string here
        refreshTokenDto.expiresAt,
        refreshTokenDto.isRevoked,
        refreshTokenDto.deviceInfo,
        refreshTokenDto.ipAddress,
        refreshTokenDto.createdAt,
        refreshTokenDto.lastUsedAt,
        refreshTokenDto.updatedAt
      );

      const deviceDescription = refreshTokenDomain.getSessionDescription();

      const revokedToken = await this.refreshTokenRepository.revokeByTokenId(refreshTokenDto.id!);

      return {
        success: !!revokedToken,
        message: revokedToken ?
          `Successfully logged out from ${deviceDescription}` :
          'Failed to logout from the specified device',
        loggedOutDevices: revokedToken ? 1 : 0,
        deviceDescription
      };
    } catch (error) {
      return this.handleLogoutError(error, userId);
    }
  }

  /**
   * Cleanup method to remove expired tokens
   * This can be called periodically as a maintenance task
   */
  async cleanupExpiredTokens(): Promise<{ success: boolean; cleanedCount: number }> {
    try {
      const cleanedCount = await this.refreshTokenRepository.revokeExpired();
      console.log(`Cleaned up ${cleanedCount} expired tokens`);

      return {
        success: true,
        cleanedCount
      };
    } catch (error) {
      console.error('Error during token cleanup:', error);
      return {
        success: false,
        cleanedCount: 0
      };
    }
  }
}