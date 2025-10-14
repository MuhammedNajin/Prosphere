import { ideahub } from "googleapis/build/src/apis/ideahub";
import { DeviceInfo, IRefreshToken } from "../interface/IRefreshToken";

export class RefreshToken implements IRefreshToken {
  public id: string;
  public userId: string;
  public token: string;
  public expiresAt: Date;
  public isRevoked: boolean;
  public deviceInfo: DeviceInfo;
  public ipAddress: string;
  public lastUsedAt?: Date;
  public createdAt?: Date;
  public updatedAt?: Date;

  private constructor(
    userId: string,
    token: string,
    expiresAt: Date,
    deviceInfo: DeviceInfo,
    ipAddress: string,
    id: string,
    isRevoked: boolean = false,
    lastUsedAt?: Date,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.id = id;
    this.userId = userId;
    this.token = token;
    this.expiresAt = expiresAt;
    this.isRevoked = isRevoked;
    this.deviceInfo = deviceInfo;
    this.ipAddress = ipAddress;
    this.lastUsedAt = lastUsedAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(
    userId: string,
    token: string,
    expiresAt: Date,
    deviceInfo: DeviceInfo,
    ipAddress: string,
    id: string
  ): RefreshToken {
    const now = new Date();
    return new RefreshToken(
      userId,
      token,
      expiresAt,
      deviceInfo,
      ipAddress,
      id,
      false,
      now,
      now,
      now
    );
  }

  // Static factory method with automatic device detection
  static createWithUserAgent(
    userId: string,
    token: string,
    expiresAt: Date,
    userAgent: string,
    ipAddress: string,
    id: string,
  ): RefreshToken {
    const deviceInfo: DeviceInfo = {
      userAgent,
      deviceType: RefreshToken.getDeviceType(userAgent),
      deviceName: RefreshToken.getDeviceName(userAgent)
    };

    return RefreshToken.create(userId, token, expiresAt, deviceInfo, ipAddress, id);
  }

  // Static factory method to reconstruct from persistence
  static fromPersistence(
    id: string,
    userId: string,
    token: string,
    expiresAt: Date,
    isRevoked: boolean,
    deviceInfo: DeviceInfo,
    ipAddress: string,
    createdAt?: Date,
    lastUsedAt?: Date,
    updatedAt?: Date
  ): RefreshToken {
    return new RefreshToken(
      userId,
      token,
      expiresAt,
      deviceInfo,
      ipAddress,
      id,
      isRevoked,
      lastUsedAt,
      createdAt,
      updatedAt
    );
  }

  // Getters
  getId(): string | undefined { return this.id; }
  getUserId(): string { return this.userId; }
  getTokenHash(): string { return this.token; }
  getExpiresAt(): Date { return this.expiresAt; }
  getCreatedAt(): Date | undefined { return this.createdAt; }
  getDeviceInfo(): DeviceInfo { return this.deviceInfo; }
  getIpAddress(): string { return this.ipAddress; }
  getLastUsedAt(): Date | undefined { return this.lastUsedAt; }
  getUpdatedAt(): Date | undefined { return this.updatedAt; }

  // Business Logic Methods
  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  isValid(): boolean {
    return !this.isRevoked && !this.isExpired();
  }

  revoke(): void {
    this.isRevoked = true;
    this.updatedAt = new Date();
  }

  isRevokedStatus(): boolean {
    return this.isRevoked;
  }

  updateLastUsed(): void {
    this.lastUsedAt = new Date();
    this.updatedAt = new Date();
  }

  // Domain method to check if this token belongs to the same device
  isSameDevice(userAgent: string, ipAddress?: string): boolean {
    const currentDeviceType = RefreshToken.getDeviceType(userAgent);
    const storedDeviceType = this.deviceInfo.deviceType;
    
    // Simple device matching - you can make this more sophisticated
    return storedDeviceType === currentDeviceType && 
           (!ipAddress || this.ipAddress === ipAddress);
  }

  // Domain method to get a user-friendly session description
  getSessionDescription(): string {
    const deviceName = this.deviceInfo.deviceName || 'Unknown Device';
    const location = this.ipAddress ? ` from ${this.ipAddress}` : '';
    const timeAgo = this.lastUsedAt ? 
      ` (last used ${this.getTimeAgo(this.lastUsedAt)})` : '';
    
    return `${deviceName}${location}${timeAgo}`;
  }

  
  toObject(): IRefreshToken {
    return {
      id: this.id,
      userId: this.userId,
      token: this.token,
      expiresAt: this.expiresAt,
      isRevoked: this.isRevoked,
      deviceInfo: this.deviceInfo,
      ipAddress: this.ipAddress,
      createdAt: this.createdAt,
      lastUsedAt: this.lastUsedAt,
      updatedAt: this.updatedAt
    };
  }
  
  toDTO() { 
    return {
      _id: this.id,
      userId: this.userId,
      token: this.token,
      expiresAt: this.expiresAt,
      isRevoked: this.isRevoked,
      deviceInfo: this.deviceInfo,
      ipAddress: this.ipAddress,
      createdAt: this.createdAt,
      lastUsedAt: this.lastUsedAt,
      updatedAt: this.updatedAt
    };
  }

  // DOMAIN METHODS - Device Detection Logic
  private static getDeviceType(userAgent: string): string {
    if (/Mobile|Android|iPhone/i.test(userAgent)) return 'mobile';
    if (/Tablet|iPad/i.test(userAgent)) return 'tablet';
    return 'desktop';
  }

  private static getDeviceName(userAgent: string): string {
    if (/iPhone/i.test(userAgent)) return 'iPhone';
    if (/Android/i.test(userAgent)) return 'Android Device';
    if (/iPad/i.test(userAgent)) return 'iPad';
    if (/Windows/i.test(userAgent)) return 'Windows PC';
    if (/Mac/i.test(userAgent)) return 'Mac';
    return 'Unknown Device';
  }

  // Helper method for time formatting
  private getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }

  // Domain validation methods
  static validateExpirationTime(expiresAt: Date): boolean {
    const now = new Date();
    const maxExpiry = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days max
    return expiresAt > now && expiresAt <= maxExpiry;
  }
}
