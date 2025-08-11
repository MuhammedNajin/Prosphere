import { redisClient, RedisClient } from "@/infrastructure/database/redis/connection";
import { IUser } from "@domain/entities/interfaces";

interface IRedisService {
  setOtp(otp: string, email: string): Promise<void>;
  getOtp(email: string): Promise<string | null>;
  setUser(email: string, user: IUser): Promise<void>;
  getUser(email: string): Promise<IUser | null>;
  setToken(token: string, email: string): Promise<void>;
  getToken(email: string): Promise<string | null>;
}

export class RedisService implements IRedisService {
  private readonly client: RedisClient;
  private readonly OTP_TTL = 60;
  private readonly USER_TTL = 3600;
  private readonly TOKEN_TTL = 1800;

  constructor(client: RedisClient = redisClient) {
    this.client = client;
  }

  async setOtp(otp: string, email: string): Promise<void> {
    await this.client.setEx(`otp:${email}`, this.OTP_TTL, otp);
  }

  async getOtp(email: string): Promise<string | null> {
    return await this.client.get(`otp:${email}`);
  }

  async setUser(email: string, user: IUser): Promise<void> {
    await this.client.setEx(`user:${email}`, this.USER_TTL, JSON.stringify(user));
  }

  async getUser(email: string): Promise<IUser | null> {
    const user = await this.client.get(`user:${email}`);
    return user ? JSON.parse(user) : null;
  }

  async setToken(token: string, email: string): Promise<void> {
    await this.client.setEx(`password-reset:${email}`, this.TOKEN_TTL, token);
  }

  async getToken(email: string): Promise<string | null> {
    return await this.client.get(`password-reset:${email}`);
  }
}