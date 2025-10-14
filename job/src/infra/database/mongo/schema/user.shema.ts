import { IUser } from "@domain/interface/IUser";
import { UserRole } from "@muhammednajinnprosphere/common";
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUserDoc extends IUser, Document {
  id: string;
}

export interface IUserModel extends Model<IUserDoc> {
  build(attrs: Partial<IUser>): IUserDoc;
  generateId(): string;
}

const userSchema = new Schema<IUserDoc, IUserModel>(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    phone: { type: String, required: true, sparse: true, unique: true, trim: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.USER, required: true },
    isVerified: { type: Boolean, default: false },
    headline: { type: String, trim: true },
    profileImageKey: { type: String },
    coverImageKey: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

userSchema.statics.build = function (attrs: Partial<IUser>) {
  return new this(attrs);
};

userSchema.statics.generateId = function () {
  return new mongoose.Types.ObjectId().toHexString();
};

export const UserModel = mongoose.model<IUserDoc, IUserModel>("User", userSchema);