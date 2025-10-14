export interface IRefreshToken {
  id?: string;
  userId: string;
  token: string;
  expiresAt: Date;
  isRevoked: boolean;
  deviceInfo: {
    userAgent: string;
    deviceType: string;
    deviceName: string;
  };
  ipAddress: string;
  lastUsedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}


export interface IRefreshTokenDTO extends Omit<IRefreshToken, "id"> {
   _id: string;
}

export interface DeviceInfo {
  userAgent: string;
  deviceType: string;
  deviceName: string;
}