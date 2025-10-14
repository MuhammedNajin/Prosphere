import { IRefreshToken } from "@/domain/interface/IRefreshToken";
import { IBaseCommandRepository, IBaseQueryRepository } from "./IBaseRepository";

/**
 * Defines all "read" operations specific to the RefreshToken entity.
 */
export interface IRefreshTokenQueryRepository extends IBaseQueryRepository<IRefreshToken, 'refreshTokens'> {
  findByUserId(userId: string): Promise<IRefreshToken[]>;
  findActiveByUserId(userId: string): Promise<IRefreshToken[]>;
  findByUserIdAndDevice(userId: string, deviceInfo: string): Promise<IRefreshToken | null>;
}

/**
 * Defines all "write" operations specific to the RefreshToken entity.
 */
export interface IRefreshTokenCommandRepository extends IBaseCommandRepository<IRefreshToken> {
  create(attrs: IRefreshToken): Promise<IRefreshToken>;
  revokeAllForUser(userId: string): Promise<number>; // Returns count of revoked tokens
  revokeByTokenId(tokenId: string): Promise<IRefreshToken | null>;
  revokeExpired(): Promise<number>; // Cleanup method
  updateLastUsed(tokenId: string): Promise<IRefreshToken | null>;
}

/**
 * Combines the query and command interfaces for a complete RefreshToken repository definition.
 */
export interface IRefreshTokenRepository 
  extends IRefreshTokenQueryRepository, IRefreshTokenCommandRepository {
  generateId(): string;
}