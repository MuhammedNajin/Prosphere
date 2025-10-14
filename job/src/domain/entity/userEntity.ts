import { UserRole } from "@muhammednajinnprosphere/common";
import { IUser } from "../interface/IUser";

export class User implements IUser {
  private _id: string;
  private _username: string;
  private _email: string;
  private _phone: string;
  private _role: UserRole;
  private _isVerified: boolean;
  private _headline?: string;
  private _profileImageKey?: string;
  private _coverImageKey?: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: IUser) {
    if (!props.id) throw new Error("User ID is required");
    if (!props.username?.trim()) throw new Error("Username is required");
    if (!props.email?.trim()) throw new Error("Email is required");
    if (!Object.values(UserRole).includes(props.role)) {
      throw new Error("Invalid user role");
    }

    this._id = props.id;
    this._username = props.username.trim();
    this._email = props.email.trim();
    this._phone = props.phone;
    this._role = props.role;
    this._isVerified = props.isVerified ?? false;
    this._headline = props.headline;
    this._profileImageKey = props.profileImageKey;
    this._coverImageKey = props.coverImageKey;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  // --- FACTORY ---
  public static create(props: IUser): User {
    return new User(props);
  }

  // --- GETTERS ---
  get id(): string { return this._id; }
  get username(): string { return this._username; }
  get email(): string { return this._email; }
  get phone(): string { return this._phone; }
  get role(): UserRole { return this._role; }
  get isVerified(): boolean { return this._isVerified; }
  get headline(): string | undefined { return this._headline; }
  get profileImageKey(): string | undefined { return this._profileImageKey; }
  get coverImageKey(): string | undefined { return this._coverImageKey; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  // --- DOMAIN METHODS ---
  public verify(): void {
    this._isVerified = true;
    this.touch();
  }

  public unverify(): void {
    this._isVerified = false;
    this.touch();
  }

  public updateProfile(attrs: Partial<IUser>): void {
    if (attrs.username) this.username = attrs.username;
    if (attrs.email) this.email = attrs.email;
    if (attrs.phone) this.phone = attrs.phone;
    if (attrs.headline) this._headline = attrs.headline;
    if (attrs.profileImageKey) this._profileImageKey = attrs.profileImageKey;
    if (attrs.coverImageKey) this._coverImageKey = attrs.coverImageKey;
    this.touch();
  }

  // --- SETTERS (controlled) ---
  set username(value: string) {
    if (!value?.trim()) throw new Error("Username is required");
    this._username = value.trim();
    this.touch();
  }

  set email(value: string) {
    if (!value?.trim()) throw new Error("Email is required");
    this._email = value.trim();
    this.touch();
  }

  set phone(value: string) {
    this._phone = value;
    this.touch();
  }

  // --- UTILITY ---
  private touch(): void {
    this._updatedAt = new Date();
  }

  // --- SERIALIZATION ---
  public toObject(): IUser {
    return {
      id: this._id,
      username: this._username,
      email: this._email,
      phone: this._phone,
      role: this._role,
      isVerified: this._isVerified,
      headline: this._headline,
      profileImageKey: this._profileImageKey,
      coverImageKey: this._coverImageKey,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  public toDTO() {
    return {
      _id: this._id,
      username: this._username,
      email: this._email,
      headline: this._headline,
      profileImageUrl: this._profileImageKey,
      coverImageUrl: this._coverImageKey,
      isVerified: this._isVerified,
      role: this._role,
    };
  }

  public toJSON(): IUser {
    return this.toObject();
  }
}
