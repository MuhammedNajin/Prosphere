import { JwtPayload } from "jsonwebtoken";

/**
 * @interface IJwtUserData
 * @description Represents the user-specific data embedded within the JWT payload.
 */
export interface IJwtUserData {
  userId: string;
  role: string;
  username: string;
  email: string;
  tokenId: string;
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
 * @description Defines the contract for a service that handles JWT access token operations.
 * This includes generating, verifying, and decoding access tokens and utility tokens.
 */
export interface ITokenService {
  
  /**
   * Decodes and verifies an access token.
   * @template T - The expected type of the decoded payload.
   * @param {string} token - The access token to decode.
   * @returns {Promise<T>} A promise that resolves with the decoded payload.
   * @throws {Error} If the token is invalid or expired.
   */
  decodeAccessToken<T>(token: string): Promise<T>;

  /**
   * Generates a new access token with standard claims and user data.
   * @template T - A type extending IJwtUserData, representing the user-specific data.
   * @param {T} data - The user data to embed in the token.
   * @returns {string} The generated JWT access token.
   */
  generateAccessToken<T extends IJwtUserData>(data: T): string;

  /**
   * Generates a JWT token with custom payload and settings.
   * @param {IJwtUserData} payload - The user data to embed in the token.
   * @param {string} secret - The secret key to sign the token.
   * @param {string} expiresIn - Token expiration time (e.g., '1h', '7d').
   * @returns {string} The generated JWT token.
   * @throws {Error} If the secret key is missing.
   */
  generateJwtToken<T extends string | object | Buffer>(payload: T, secret: string, expiresIn: string): string;

  /**
   * Verifies the signature and expiration of a generic JWT token.
   * @param {string} token - The JWT token to verify.
   * @param {string} secret - The secret key used to sign the token.
   * @returns {Promise<JwtPayload | string>} A promise that resolves with the decoded payload if verification is successful.
   * @throws {Error} If the token secret is missing or token is invalid.
   */
  verifyToken(token: string, secret: string): Promise<JwtPayload | string>;

  /**
   * Verifies an access token specifically using the application's access token secret.
   * @param {string} token - The access token to verify.
   * @returns {Promise<JwtPayload | string>} A promise that resolves with the decoded payload if verification is successful.
   * @throws {Error} If the token is invalid or expired.
   */
  verifyAccessToken(token: string): Promise<JwtPayload | string>;

  /**
   * Generates a unique token for various purposes (password reset, email verification, etc.).
   * Typically a UUID.
   * @returns {string} The generated UUID token.
   */
  generateToken(): string;

  /**
   * Decodes a JWT token without verifying its signature.
   * Useful for reading claims from the payload before verification.
   * @param {string} token - The JWT token to decode.
   * @returns {JwtPayload | null} The decoded payload as a JSON object, or null if the token is invalid.
   */
  decode(token: string): JwtPayload | null;

  /**
   * Checks if a JWT token has expired.
   * @param {string} token - The JWT token to check.
   * @returns {boolean} True if the token is expired, false otherwise.
   */
  isTokenExpired(token: string): boolean;

  /**
   * Gets the expiration date of a JWT token.
   * @param {string} token - The JWT token to extract expiration from.
   * @returns {Date | null} The expiration date, or null if the token doesn't have an expiration or is invalid.
   */
  getTokenExpiration(token: string): Date | null;
}