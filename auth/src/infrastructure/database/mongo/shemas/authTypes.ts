import { IAuth } from "@/domain/interface/IAuth";
import { UserRole, AuthProvider } from "@/shared/constance";
import mongoose, { Document, Model } from "mongoose";

/**
 * @interface IAuthAttrs
 * @description Attributes for creating a new Auth document.
 * @property {string} username - The user's unique username for login.
 * @property {string} email - The user's primary email for login.
 * @property {string} password - The user's raw, unhashed password.
 * @property {mongoose.Types.ObjectId} user - The ObjectId of the associated User profile document.
 * @property {AuthProvider} [provider] - The authentication method (e.g., 'default', 'google').
 * @property {string} [phone] - The user's phone number, optional.
 */

/**
 * @interface IAuthDoc
 * @description A Mongoose document representing an authentication record.
 * @property {string} id - The document's unique identifier (_id).
 * @property {string} username - The user's unique username.
 * @property {string} email - The user's unique email address.
 * @property {string} phone - The user's unique phone number.
 * @property {string} password - The hashed password (typically not selected in queries).
 * @property {AuthProvider} provider - The authentication provider used.
 * @property {UserRole} role - The user's role within the system (e.g., 'user', 'admin').
 * @property {boolean} isVerified - Flag indicating if the user's email is verified.
 * @property {boolean} isBlocked - Flag indicating if the user's account is blocked.
 * @property {mongoose.Types.ObjectId} user - Reference to the associated User profile.
 * @property {Date} createdAt - Timestamp of document creation.
 * @property {Date} updatedAt - Timestamp of the last update.
 */
export interface IAuthDoc extends Document {
  id: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  provider: AuthProvider;
  role: UserRole;
  isVerified: boolean;
  isBlocked: boolean;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @interface IAuthModel
 * @description The Mongoose model for Auth documents, including static methods.
 */
export interface IAuthModel extends Model<IAuthDoc> {
  build(attrs: IAuth): IAuthDoc;
}