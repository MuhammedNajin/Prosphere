import { IAuth } from "@/domain/interface/IAuth";
import { SigninResponse } from "@/presentation/IResponse";
import { HttpStatusCode, ResponseMapper, ResponseWrapper, Time } from "@muhammednajinnprosphere/common";
import { CookieOptions, Request, Response } from "express";
import { TOKEN_TYPE } from "../types/enums";

// Cookie configuration
const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions  = {
  httpOnly: true,                                    
  secure: process.env.NODE_ENV === 'production',    
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',                       
  maxAge: Time.DAYS * 7,                 
  path: '/'
};

const ACCESS_TOKEN_COOKIE_OPTIONS: CookieOptions  = {
  httpOnly: true,                                    
  secure: process.env.NODE_ENV === 'production',    
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',                       
  maxAge: Time.MINUTES * 15,                          
  path: '/'                                          
};

export function getRequestMeta(req: Request) {
  return {
    ipAddress: req.ip || req.connection.remoteAddress || "127.0.0.1",
    userAgent: req.get("User-Agent") ?? '',
  };
}

export function mapUserResponse(user: IAuth): SigninResponse {
  return new ResponseMapper<IAuth, SigninResponse>({
    fields: {
      id: "id",
      email: "email",
      username: "username",
      phone: "phone",
      role: "role",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }).toResponse(user);
}

export function sendResponse(
  res: Response,
  status: HttpStatusCode,
  data: object,
  message: string
) {
  new ResponseWrapper(res).status(status).success(data, message);
}

/**
 * Sends authentication response without tokens in body
 * Tokens are set as HTTP-only cookies
 */
export function sendAuthResponse(
  res: Response,
  status: HttpStatusCode,
  data: object,
  message: string
) {
  // Remove any token fields from response data for security
  const sanitizedData = { ...data };
  delete (sanitizedData as any).accessToken;
  delete (sanitizedData as any).refreshToken;
  
  new ResponseWrapper(res).status(status).success(sanitizedData, message);
}

/**
 * Sets both access and refresh tokens as HTTP-only cookies
 */
export function setAuthTokenCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie(TOKEN_TYPE.ACCESS_TOKEN, accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
  res.cookie(TOKEN_TYPE.REFRESH_TOKEN, refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
}

/**
 * Sets refresh token as HTTP-only cookie
 */
export function setRefreshTokenCookie(res: Response, refreshToken: string) {
  res.cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
}

/**
 * Sets access token as HTTP-only cookie
 */
export function setAccessTokenCookie(res: Response, accessToken: string) {
  res.cookie('accessToken', accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
}

/**
 * Clears both auth token cookies
 */
export function clearAuthTokenCookies(res: Response) {
  res.clearCookie('accessToken', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.clearCookie('refreshToken', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
}

/**
 * Clears refresh token cookie
 */
export function clearRefreshTokenCookie(res: Response) {
  res.clearCookie('refreshToken', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
}

/**
 * Gets access token from request cookie
 */
export function getAccessTokenFromCookie(req: Request): string | undefined {
  return req.cookies?.accessToken;
}

/**
 * Gets refresh token from request cookie
 */
export function getRefreshTokenFromCookie(req: Request): string | undefined {
  return req.cookies?.refreshToken;
}

/**
 * Gets both tokens from request cookies
 */
export function getAuthTokensFromCookies(req: Request) {
  return {
    accessToken: req.cookies?.accessToken,
    refreshToken: req.cookies?.refreshToken
  };
}

/**
 * Enhanced request meta that includes both cookies
 */
export function getAuthRequestMeta(req: Request) {
  return {
    ipAddress: req.ip || req.connection.remoteAddress || "127.0.0.1",
    userAgent: req.get("User-Agent") ?? '',
    accessToken: getAccessTokenFromCookie(req),
    refreshToken: getRefreshTokenFromCookie(req)
  };
}

// Type definitions for better TypeScript support
export interface AuthResponse {
  user: SigninResponse;
  // No tokens in response - they're sent via cookies
}

export interface RequestMeta {
  ipAddress: string;
  userAgent: string;
}

export interface AuthRequestMeta extends RequestMeta {
  accessToken?: string;
  refreshToken?: string;
}

// Constants for cookie configuration
export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken'
} as const;

// Environment-based cookie settings
export const getCookieSettings = () => ({
  ...REFRESH_TOKEN_COOKIE_OPTIONS,
  secure: process.env.NODE_ENV === 'production',
  domain: process.env.COOKIE_DOMAIN || undefined, // Set domain if needed for subdomains
});

/**
 * Middleware helper to ensure cookies are parsed
 * Add this to your Express app setup
 */
export const cookieMiddleware = () => {
  const cookieParser = require('cookie-parser');
  return cookieParser(process.env.COOKIE_SECRET || 'your-secret-key');
};

// Development helper - logs cookie information (remove in production)
export function logCookieInfo(req: Request, action: string) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${action}] Cookies:`, {
      refreshToken: req.cookies?.refreshToken ? 'Present' : 'Missing',
      allCookies: Object.keys(req.cookies || {})
    });
  }
}