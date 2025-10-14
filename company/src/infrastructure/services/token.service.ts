import { injectable } from "inversify";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";
import type { StringValue } from "ms";
import {
  IJWTClaimWithUser,
  IJwtUserData,
  ITokenService,
  StandardJwtClaims,
} from "../interface/services/ITokenService";
import { getEnvs } from '@muhammednajinnprosphere/common';

const {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_EXPIRY,
  SERVICE_NAME,
} = getEnvs(
  "JWT_ACCESS_TOKEN_SECRET",
  "JWT_ACCESS_TOKEN_EXPIRY",
  "SERVICE_NAME"
);

const defaultStandardJwtClaims: StandardJwtClaims = {
  iat: Date.now(),
  iss: SERVICE_NAME,
  aud: "prosphere-frontend",
  jti: uuidv4(),
};

@injectable()
export class TokenService implements ITokenService {
  
  constructor() {
    // No longer need Google OAuth client
  }

  /**
   * Generate JWT token with custom payload and settings
   */
  generateJwtToken<T extends string | object | Buffer>(
  payload: T,
  secret: string,
  expiresIn: string
): string {
  if (!secret) {
    throw new Error("Server configuration error: Missing JWT secret key");
  }

  return jwt.sign(payload, secret, { expiresIn });
}


  /**
   * Decode and verify access token
   */
  public decodeAccessToken<T>(token: string): Promise<T> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        JWT_ACCESS_TOKEN_SECRET,
        (err: Error | null, decoded: unknown) => {
          if (err) {
            reject(err);
          } else {
            resolve(decoded as T);
          }
        }
      );
    });
  }

  /**
   * Generate access token with standard claims
   */
  public generateAccessToken<T extends IJwtUserData>(data: T): string {
    const claims = { 
      ...defaultStandardJwtClaims, 
      user: data,
      jti: uuidv4() // Generate new unique ID for each token
    };
    
    return jwt.sign(
      claims as IJWTClaimWithUser,
      JWT_ACCESS_TOKEN_SECRET as jwt.Secret,
      {
        algorithm: "HS256",
        expiresIn: JWT_ACCESS_TOKEN_EXPIRY.toString() as StringValue,
      }
    );
  }

  /**
   * Verify any token with provided secret
   */
  async verifyToken(
    token: string,
    secret: string
  ): Promise<jwt.JwtPayload | string> {
    if (!secret) {
      throw new Error("Server configuration error: Missing token secret");
    }
    return jwt.verify(token, secret);
  }

  /**
   * Verify access token specifically
   */
  async verifyAccessToken(token: string): Promise<jwt.JwtPayload | string> {
    return this.verifyToken(token, JWT_ACCESS_TOKEN_SECRET);
  }

  /**
   * Generate simple UUID token (for other purposes like reset tokens)
   */
  generateToken(): string {
    return uuidv4();
  }

  /**
   * Decode token without verification (useful for reading expired tokens)
   */
  decode(token: string): jwt.JwtPayload | null {
    return jwt.decode(token) as jwt.JwtPayload | null;
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decode(token);
      if (!decoded || !decoded.exp) {
        return true;
      }
      return Date.now() >= decoded.exp * 1000;
    } catch (error) {
      return true;
    }
  }

  /**
   * Get token expiration date
   */
  getTokenExpiration(token: string): Date | null {
    try {
      const decoded = this.decode(token);
      if (!decoded || !decoded.exp) {
        return null;
      }
      return new Date(decoded.exp * 1000);
    } catch (error) {
      return null;
    }
  }
}