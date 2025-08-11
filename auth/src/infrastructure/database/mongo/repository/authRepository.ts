import { injectable } from "inversify";
// You will create this new interface
import { IAuth } from "@domain/interface/IAuth" // Your domain interface for Auth
import { AuthModel } from "../shemas/authShema";
import { IAuthRepository } from "@/infrastructure/interface/repository/IAuthRepository";
import mongoose from "mongoose";

@injectable()
export class AuthRepository implements IAuthRepository {
  private model = AuthModel;

  generateId(): string {
    return new mongoose.Types.ObjectId().toHexString();
  }

  /**
   * Finds an authentication record by email.
   * Includes the password field for verification purposes.
   */
  async findByEmail(email: string): Promise<IAuth | null> {
    return await this.model.findOne({ email }).select("+password");
  }

  async findByUsername(username: string): Promise<IAuth | null> {
    return await this.model.findOne({ username }).select("+password");
  }

  /**
   * Finds an authentication record by its associated user ID.
   */
  async findByUserId(userId: string): Promise<IAuth | null> {
    return await this.model.findOne({ user: userId });
  }

  /**
   * Creates a new authentication document.
   */
  async create(attrs: IAuth): Promise<IAuth> {
    const auth = this.model.build(attrs);
    return await auth.save();
  }

  /**
   * Updates an authentication document by its user ID.
   */
  async updateByUserId(
    userId: string,
    attrs: Partial<IAuth>
  ): Promise<IAuth | null> {
    return await this.model.findOneAndUpdate({ user: userId }, attrs, {
      new: true,
    });
  }

  async updateByEmail(
    email: string,
    attrs: Partial<IAuth>
  ): Promise<IAuth | null> {
    return await this.model.findOneAndUpdate({ email }, attrs, { new: true });
  }

  /**
   * Deletes an authentication record by its user ID.
   */
  async deleteByUserId(userId: string): Promise<boolean> {
    const result = await this.model.deleteOne({ user: userId });
    return result.deletedCount === 1;
  }

  // Base query methods required by IAuthRepository
  async findById(id: string): Promise<IAuth | null> {
    return await this.model.findById(id).select("+password");
  }

  async findAll(
    page = 1,
    limit = 10
  ): Promise<{ total: number } & { auths: IAuth[] }> {
    const skip = (page - 1) * limit;
    const [total, docs] = await Promise.all([
      this.model.countDocuments(),
      this.model.find().skip(skip).limit(limit),
    ]);
    return { total, auths: docs as unknown as IAuth[] };
  }

  // Base command methods required by IAuthRepository
  async update(id: string, attrs: Partial<IAuth>): Promise<IAuth | null> {
    return await this.model.findByIdAndUpdate(id, attrs, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
}
