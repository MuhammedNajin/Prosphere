import { injectable } from "inversify";

import { IRefreshTokenRepository } from "@/infrastructure/interface/repository/IRefreshTokenRepository";
import mongoose from "mongoose";
import { HashService } from "@infrastructure/services/hash.service";
import { RefreshTokenModel } from "../shemas/refresh-token.schema";
import { IRefreshToken } from "@/domain/interface/IRefreshToken";

@injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  private model = RefreshTokenModel;
  private hashService = new HashService();
 
  generateId(): string {
    return new mongoose.Types.ObjectId().toHexString();
  }

  /**
 * Revokes a specific refresh token by its ID.
 */
async revokeByTokenId(tokenId: string): Promise<IRefreshToken | null> {
  return await this.model.findByIdAndUpdate(
    tokenId,
    { isRevoked: true },
    { new: true }
  );
}

/**
 * Updates the lastUsedAt timestamp for a token by its ID.
 */
async updateLastUsed(tokenId: string): Promise<IRefreshToken | null> {
  return await this.model.findByIdAndUpdate(
    tokenId,
    { lastUsedAt: new Date() },
    { new: true }
  );
}

  /**
   * Finds all refresh tokens for a user.
   */
  async findByUserId(userId: string): Promise<IRefreshToken[]> {
    return await this.model.find({ userId });
  }

  /**
   * Finds all active (non-revoked, non-expired) refresh tokens for a user.
   */
  async findActiveByUserId(userId: string): Promise<IRefreshToken[]> {
    return await this.model.find({
      userId,
      isRevoked: false,
      expiresAt: { $gt: new Date() }
    });
  }

  /**
   * Finds a refresh token by user and device info.
   */
  async findByUserIdAndDevice(userId: string, deviceInfo: string): Promise<IRefreshToken | null> {
    return await this.model.findOne({
      userId,
      'deviceInfo.userAgent': deviceInfo,
      isRevoked: false,
      expiresAt: { $gt: new Date() }
    });
  }

  /**
   * Creates a new refresh token document.
   */
  async create(attrs: IRefreshToken): Promise<IRefreshToken> {
    console.log("repository refresh token ", attrs)
    const refreshToken = this.model.build(attrs);
    return await refreshToken.save();
  }

  /**
   * Revokes all refresh tokens for a user.
   */
  async revokeAllForUser(userId: string): Promise<number> {
    const result = await this.model.updateMany(
      { userId, isRevoked: false },
      { isRevoked: true }
    );
    return result.modifiedCount;
  }

  /**
   * Revokes a specific refresh token by its hash.
   */
  async revokeByTokenHash(tokenHash: string): Promise<IRefreshToken | null> {
    const hashedToken = await this.hashService.hash(tokenHash);
    return await this.model.findOneAndUpdate(
      { tokenHash: hashedToken },
      { isRevoked: true },
      { new: true }
    );
  }

  /**
   * Clean up expired tokens (even if not revoked).
   */
  async revokeExpired(): Promise<number> {
    const result = await this.model.updateMany(
      { expiresAt: { $lt: new Date() }, isRevoked: false },
      { isRevoked: true }
    );
    return result.modifiedCount;
  }

  // Base repository methods
  async findById(id: string): Promise<IRefreshToken | null> {
    return await this.model.findById(id).select('+token');
  }

  async findAll(
    page = 1,
    limit = 10
  ): Promise<{ total: number } & { refreshTokens: IRefreshToken[] }> {
    const skip = (page - 1) * limit;
    const [total, docs] = await Promise.all([
      this.model.countDocuments(),
      this.model.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
    ]);
    return { total, refreshTokens: docs as unknown as IRefreshToken[] };
  }

  async update(id: string, attrs: Partial<IRefreshToken>): Promise<IRefreshToken | null> {
    return await this.model.findByIdAndUpdate(id, attrs, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
}