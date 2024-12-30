import { redisClient } from "@/infra/database/redis/connection";
import { IUser } from "@domain/entities/interfaces";

export default {

  async setOtp(otp: string, email: string) {
    console.log(" redis ", otp, email);
    
    await redisClient.setEx(`otp${email}`, 60, otp);
  },

  async getOtp(email: string) {
    return redisClient.get(`otp${email}`);
  },

  async setUser(email: string, user: IUser) {
    await redisClient.setEx(`user${email}`, 3600, JSON.stringify(user));
  },

  async getUser(email: string) {
    const user = await redisClient.get(`user${email}`);
    return user ? JSON.parse(user) : null;
  },

  async setToken(token: string, email: string) {
    await redisClient.setEx(`password-reset${email}`, 1800, token)
  },

  async getToken(email: string) {
   return await redisClient.get(`password-reset${email}`);
  },
};
