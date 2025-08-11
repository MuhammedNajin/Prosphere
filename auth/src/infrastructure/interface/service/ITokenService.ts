import { JwtPayload } from "jsonwebtoken";

/**
 * @interface IJwtUserData
 * @description Represents the user-specific data embedded within the JWT payload.
 */
export interface IJwtUserData {
  userId: string;
  role: string;
  username: string;
  email: string
}

/**
 * @interface StandardJwtClaims
 * @description Defines the standard claims for a JWT payload as per RFC 7519.
 */
export interface StandardJwtClaims {
  iat: number; // Issued At
  iss: string; // Issuer
  aud: string; // Audience
  jti: string; // JWT ID
  exp?: number; // Expiration Time
  sub?: string; // Subject
}

/**
 * @interface IJWTClaimWithUser
 * @description Defines the complete payload structure for the application's JWTs.
 * It combines standard claims with custom user data.
 */
export interface IJWTClaimWithUser extends StandardJwtClaims {
  user: IJwtUserData;
}

/**
 * @interface ITokenService
 * @description Defines the contract for a service that handles JWT and other token-related operations.
 * This includes generating, verifying, and decoding access, refresh, and other types of tokens.
 */
export interface ITokenService {
  
  /**
   * Decodes and verifies an access token.
   * @template T - The expected type of the decoded payload.
   * @param {string} token - The access token to decode.
   * @returns {Promise<T>} A promise that resolves with the decoded payload.
   */
  decodeAccessToken<T>(token: string): Promise<T>;

  /**
   * Decodes and verifies a refresh token.
   * @template T - The expected type of the decoded payload.
   * @param {string} token - The refresh token to decode.
   * @returns {Promise<T>} A promise that resolves with the decoded payload.
   */
  decodeRefreshToken<T>(token: string): Promise<T>;

  /**
   * Generates a new access token with standard claims and user data.
   * @template T - A type extending IJwtUserData, representing the user-specific data.
   * @param {T} data - The user data to embed in the token.
   * @returns {string} The generated JWT access token.
   */
  generateAccessToken<T extends IJwtUserData>(data: T): string;

  /**
   * Generates a new refresh token with standard claims and user data.
   * @template T - A type extending IJwtUserData, representing the user-specific data.
   * @param {T} data - The user data to embed in the token.
   * @returns {string} The generated JWT refresh token.
   */
  generateRefreshToken<T extends IJwtUserData>(data: T): string;

  /**
   * Verifies the signature and expiration of a generic JWT token.
   * @param {string} token - The JWT token to verify.
   * @param {string} secret - The secret key used to sign the token.
   * @returns {Promise<JwtPayload | string>} A promise that resolves with the decoded payload if verification is successful.
   * @throws {Error} If the token secret is missing.
   */
  verifyToken(token: string, secret: string): Promise<JwtPayload | string>;

  /**
   * Generates a unique token for various purposes (password reset, email verification, etc.).
   * Typically a UUID.
   * @returns {string} The generated token.
   */
  generateToken(): string;

  /**
   * Verifies a Google ID token using the google-auth-library.
   * @param {string} token - The Google ID token received from the client.
   * @returns {Promise<JwtPayload | null>} A promise that resolves with the Google token's payload, or null if verification fails.
   * @throws {Error} If the token is invalid.
   */
  verifyGoogleAuth(token: string): Promise<JwtPayload | null>;

  /**
   * Decodes a JWT token without verifying its signature.
   * Useful for reading claims from the payload on the client-side or before verification.
   * @param {string} token - The JWT token to decode.
   * @returns {JwtPayload | null} The decoded payload as a JSON object, or null if the token is invalid.
   */
  decode(token: string): JwtPayload | null;
}
