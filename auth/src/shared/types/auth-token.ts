import { IAuth } from "@/domain/interface/IAuth";

export interface IAuthToken {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthRequestWithDevice {
  email: string;
  ipAddress: string;
  userAgent: string;
}

export interface IAuthRequestWithDevice {
  email: string;
  ipAddress: string;
  userAgent: string;
}


/**
 * Interface for refresh token request
 */
export interface IRefreshTokenRequest {
  refreshToken: string;
  ipAddress: string;
  userAgent: string;
}

/**
 * Interface for logout request
 */
export interface ILogoutRequest {
  userId: string;
  refreshToken?: string;
  logoutAll?: boolean;
}

/**
 * Interface for session management
 */
export interface ISessionRequest {
  userId: string;
  currentTokenId?: string;
}

/**
 * Interface for revoking specific session
 */
export interface IRevokeSessionRequest {
  userId: string;
  sessionId: string;
  requestingUserId: string;
}

/**
 * Common response interface for authentication
 */
export interface IAuthResponse {
  user: IAuth;
  accessToken: string;
}

/**
 * Response interface for session list
 */
export interface IUserSession {
  id: string;
  deviceName: string;
  deviceType: string;
  ipAddress: string;
  lastUsedAt: Date;
  createdAt: Date;
  isCurrent?: boolean;
}

/**
 * Response interface for logout operations
 */
export interface ILogoutResponse {
  success: boolean;
  message: string;
}

/**
 * Device information interface
 */
export interface IDeviceInfo {
  userAgent: string;
  deviceType: string;
  deviceName: string;
  ipAddress: string;
}

/**
 * Extended auth request with optional device info
 */
export interface IAuthRequestOptionalDevice {
  email: string;
  ipAddress?: string;
  userAgent?: string;
}




