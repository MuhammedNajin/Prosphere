import { injectable } from "inversify";
import jwt from "jsonwebtoken";
import { v4 as uuidv4, v4 } from "uuid";
import { OAuth2Client } from "google-auth-library";
import "dotenv/config";
import type { StringValue } from "ms";
import {
  IJWTClaimWithUser,
  IJwtUserData,
  ITokenService,
  StandardJwtClaims,
} from "../interface/service/ITokenService";
import { getEnvs } from '@muhammednajinnprosphere/common';

const {
  JWT_REFRESH_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_EXPIRY,
  JWT_REFRESH_TOKEN_EXPIRY,
  SERVICE_NAME,
} = getEnvs(
  "JWT_ACCESS_TOKEN_SECRET",
  "JWT_REFRESH_TOKEN_SECRET",
  "JWT_ACCESS_TOKEN_EXPIRY",
  "JWT_REFRESH_TOKEN_EXPIRY",
  "SERVICE_NAME"
);

const defaultStandardJwtClaims: StandardJwtClaims = {
  iat: Date.now(),
  iss: SERVICE_NAME,
  aud: "prosphere-frontend",
  jti: v4(),
};

@injectable()
export class TokenService implements ITokenService {
  private readonly googleClient: OAuth2Client;

  constructor() {
    this.googleClient = new OAuth2Client();
  }

  generateJwtToken(
    payload: IJwtUserData,
    secret: string,
    expiresIn: string
  ): string {
    if (!secret) {
      throw new Error("Server configuration error: Missing JWT secret key");
    }

    console.log("secret", secret);

    return jwt.sign(payload, secret, { expiresIn });
  }

  public decodeAccessToken<T>(token: string): Promise<T> {
    return new Promise((resolve, reject) => {
      return jwt.verify(
        token,
        JWT_ACCESS_TOKEN_SECRET,
        (err: Error | null, decode: unknown) => {
          if (err) reject(err);
          resolve(decode as T);
        }
      );
    });
  }

  public decodeRefreshToken<T>(token: string): Promise<T> {
    return new Promise((resolve, reject) => {
      return jwt.verify(
        token,
        JWT_REFRESH_TOKEN_SECRET,
        (err: Error | null, decode: unknown) => {
          if (err) reject(err);
          resolve(decode as T);
        }
      );
    });
  }

  public generateAccessToken<T extends IJwtUserData>(data: T): string {
    const claims = { ...defaultStandardJwtClaims, user: data };
    return jwt.sign(
      claims as IJWTClaimWithUser,
      JWT_ACCESS_TOKEN_SECRET as jwt.Secret,
      {
        algorithm: "HS256",
        expiresIn: JWT_ACCESS_TOKEN_EXPIRY.toString() as StringValue,
      }
    );
  }

  
  public generateRefreshToken<T extends IJwtUserData>(data: T): string {
    const claims = { ...defaultStandardJwtClaims, user: data };
    return jwt.sign(claims as IJWTClaimWithUser, JWT_REFRESH_TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: JWT_REFRESH_TOKEN_EXPIRY.toString() as StringValue,
    });
  }

  async verifyToken(
    token: string,
    secret: string
  ): Promise<jwt.JwtPayload | string> {
    if (!secret) {
      throw new Error("Server configuration error: Missing token secret");
    }
    return jwt.verify(token, secret);
  }

  generateToken(): string {
    const token = uuidv4();
    return token;
  }

  async verifyGoogleAuth(token: string): Promise<jwt.JwtPayload | null> {
    try {
      const verify = await this.googleClient.verifyIdToken({
        idToken: token,
        audience:
          "884141115056-o3pkeqli515ugoohn2qbpqasc723q90p.apps.googleusercontent.com",
      });
      console.log(verify);
      return verify.getPayload() || null;
    } catch (error) {
      console.log("Google auth verification failed:", error);
      throw new Error("Invalid Google auth token");
    }
  }

  decode(token: string): jwt.JwtPayload | null {
    return jwt.decode(token) as jwt.JwtPayload | null;
  }
}
