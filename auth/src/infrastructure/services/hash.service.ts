import { injectable } from "inversify";
import bcrypt from "bcrypt";
import "dotenv/config";
import { IHashService } from "../interface/service/IHashService";


@injectable()
export class HashService implements IHashService {
  private readonly saltRounds: number;

  constructor() {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
    if (isNaN(saltRounds) || saltRounds <= 0) {
      throw new Error("Server configuration error: Invalid or missing BCRYPT_SALT_ROUNDS");
    }
    this.saltRounds = saltRounds;
  }

  async hash(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, this.saltRounds);
    } catch (error) {
      console.error("Password hashing failed:", error);
      throw new Error("Failed to hash password");
    }
  }

  async compare(plainText: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(plainText, hashedPassword);
    } catch (error) {
      console.error("Password comparison failed:", error);
      throw new Error("Failed to compare passwords");
    }
  }
}