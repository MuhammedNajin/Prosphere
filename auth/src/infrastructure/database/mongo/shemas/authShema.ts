import mongoose, { Schema } from "mongoose";
import { HashService } from "@infrastructure/services/hash.service";
import { AuthProvider, UserRole } from "@/shared/constance";
import { IAuthDoc, IAuthModel } from "./authTypes";
import { IAuth } from "@/domain/interface/IAuth";

const authSchema = new Schema<IAuthDoc, IAuthModel>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: { type: String, sparse: true, unique: true, trim: true },
    password: { type: String, required: true, select: false },
    provider: {
      type: String,
      enum: Object.values(AuthProvider),
      default: AuthProvider.DEFAULT,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
      required: true,
    },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },

    // The crucial link to the User profile model
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        // Do NOT expose the password, even if it's hashed
        delete ret.password;
      },
    },
  }
);

// Password hashing logic now lives with the data it protects
authSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    try {
      const hashService = new HashService();
      this.password = await hashService.hash(this.password);
    } catch (error) {
      return next(error as Error);
    }
  }
  next();
});

authSchema.statics.build = function (attrs: IAuth) {
  return new this(attrs);
};

export const AuthModel = mongoose.model<IAuthDoc, IAuthModel>(
  "Auth",
  authSchema
);