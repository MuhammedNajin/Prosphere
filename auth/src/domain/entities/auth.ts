import mongoose from "mongoose";
import { AuthProvider, UserRole } from "@/shared/constance";
import { IAuth } from "../interface/IAuth";

/**
 * @class Auth
 * @implements {IAuth}
 * @description Represents an authentication entity, encapsulating security and access control.
 */
export class Auth implements IAuth {
  private _id: string;
  private _username: string;
  private _email: string;
  private _phone: string;
  private _password: string;
  private _provider: AuthProvider;
  private _role: UserRole;
  private _isVerified: boolean;
  private _isBlocked: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(data: Partial<IAuth>) {
    this._id = data.id || new mongoose.Types.ObjectId().toHexString();
    this._username = data.username!;
    this._email = data.email!;
    this._password = data.password!;
    this._phone = data.phone || "";
    this._provider = data.provider || AuthProvider.DEFAULT;
    this._role = data.role || UserRole.USER;
    this._isVerified = data.isVerified || false;
    this._isBlocked = data.isBlocked || false;
    this._createdAt = data.createdAt || new Date();
    this._updatedAt = data.updatedAt || new Date();
  }

  // --- GETTERS ---
  get id(): string { return this._id; }
  get username(): string { return this._username; }
  get email(): string { return this._email; }
  get phone(): string { return this._phone; }
  get password(): string { return this._password; }
  get provider(): AuthProvider { return this._provider; }
  get role(): UserRole { return this._role; }
  get isVerified(): boolean { return this._isVerified; }
  get isBlocked(): boolean { return this._isBlocked; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  // --- SETTERS ---
  set role(value: UserRole) {
    this._role = value;
    this.touch();
  }
  set password(value: string) {
    this._password = value;
    this.touch();
  }
  set username(value: string) {
    this._username = value;
    this.touch();
  }

  /**
   * Updates the `updatedAt` timestamp.
   */
  private touch(): void {
    this._updatedAt = new Date();
  }

  /**
   * Marks the user's account as verified.
   */
  public verify(): void {
    this._isVerified = true;
    this.touch();
  }

  /**
   * Checks if the user can log in.
   */
  public canLogin(): boolean {
    return this.isVerified && !this.isBlocked;
  }

  /**
   * Blocks the user account.
   */
  public block(): void {
    this._isBlocked = true;
    this.touch();
  }

  /**
   * Unblocks the user account.
   */
  public unBlock(): void {
    this._isBlocked = false;
    this.touch();
  }

  /**
   * Checks if the user has admin rights.
   */
  public isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  /**
   * Validates a user-provided OTP.
   */
  public isOtpValid(cachedOtp: string, otpFromUser: string): boolean {
    return cachedOtp === otpFromUser;
  }

  /**
   * Static factory method to create an Auth entity.
   */
  public static create(data: Partial<IAuth>): Auth {
    if (!data.email || !data.password || !data.username) {
        throw new Error("Username, email, and password are required to create an Auth entity.");
    }
    return new Auth(data);
  }

  /**
   * Returns a plain object representation of the entity.
   */
  public toObject(): IAuth {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      phone: this.phone,
      password: this.password,
      provider: this.provider,
      role: this.role,
      isVerified: this.isVerified,
      isBlocked: this.isBlocked,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}