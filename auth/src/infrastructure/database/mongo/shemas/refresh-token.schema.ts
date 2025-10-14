import mongoose, { Schema } from "mongoose";
import { HashService } from "@infrastructure/services/hash.service";
import { IRefreshToken } from "@/domain/interface/IRefreshToken";
import { IRefreshTokenDoc, IRefreshTokenModel } from "./refresh-token-types";

const refreshTokenSchema = new Schema<IRefreshTokenDoc, IRefreshTokenModel>(
  {
    userId: {
      type: String,
      required: true,
      index: true, 
    },
    token: {
      type: String,
      required: true,
      unique: true,
      select: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 },
    },
    isRevoked: {
      type: Boolean,
      default: false,
      required: true,
    },
    deviceInfo: {
      userAgent: { type: String },
      deviceType: { type: String }, 
      deviceName: { type: String },
    },
    ipAddress: {
      type: String,
      required: true,
    },
    lastUsedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.tokenHash;
      },
    },
  }
);

refreshTokenSchema.index({ userId: 1, isRevoked: 1 });
refreshTokenSchema.index({ userId: 1, expiresAt: 1 });

refreshTokenSchema.pre("save", async function (next) {
  if (this.isModified("token") && this.token) {
    try {
      const hashService = new HashService();
      this.token = await hashService.hash(this.token);
    } catch (error) {
      return next(error as Error);
    }
  }
  next();
});

refreshTokenSchema.statics.build = function (attrs: IRefreshToken) {
  return new this(attrs);
};

export const RefreshTokenModel = mongoose.model<IRefreshTokenDoc, IRefreshTokenModel>(
  "RefreshToken",
  refreshTokenSchema
);