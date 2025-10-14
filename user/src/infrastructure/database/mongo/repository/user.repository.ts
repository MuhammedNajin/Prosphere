import { injectable } from "inversify";
import { IUser } from "@domain/interface/IUser";
import { IUserRepository } from "@/infrastructure/interface/repository/IUserRepository";
import { UserModel } from "../shemas/user.schema";


/**
 * @class UserRepository
 * @implements {IUserRepository}
 * @description Manages data persistence and retrieval for User entities,
 * mirroring the structure of the AuthRepository.
 */
@injectable()
export class UserRepository implements IUserRepository {
  private model = UserModel

  // --- Base Command Methods ---

  async create(attrs: Partial<IUser>): Promise<IUser> {
    const user = this.model.build(attrs);
    await user.save();
    return user;
  }

  async updateArrayField(
    email: string, 
    fieldPath: string, 
    operation: 'push' | 'pull' | 'set',
    value: any
  ): Promise<IUser | null> {
    let updateOperation: any = {};
    
    switch (operation) {
      case 'push':
        updateOperation = { $push: { [fieldPath]: value } };
        break;
      case 'pull':
        updateOperation = { $pull: { [fieldPath]: value } };
        break;
      case 'set':
        updateOperation = { $set: { [fieldPath]: value } };
        break;
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }

    return await this.model.findOneAndUpdate(
      { email },
      updateOperation,
      { new: true, runValidators: true }
    );
  }


  async update(id: string, attrs: Partial<IUser>): Promise<IUser | null> {
    return await this.model.findByIdAndUpdate(id, { $set: attrs }, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }

  // --- Base Query Methods ---

  async findById(id: string): Promise<IUser | null> {
    return await this.model.findById(id);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.model.findOne({ email });
  }

  async findAll(page = 1, limit = 10): Promise<{ total: number; users: IUser[] }> {
    const skip = (page - 1) * limit;
    const [total, users] = await Promise.all([
      this.model.countDocuments(),
      this.model.find().skip(skip).limit(limit),
    ]);
    return { total, users };
  }




  async search(query: string): Promise<IUser[]> {
    console.log('query', query);
    return await this.model.find({
      username: { $regex: query, $options: 'i' }
    });
  }

  async addResume(id: string, resumeKey: string): Promise<IUser | null> {
    return await this.model.findByIdAndUpdate(id,
      { $addToSet: { resumeKeys: resumeKey } },
      { new: true }
    );
  }

  async removeResume(id: string, resumeKey: string): Promise<IUser | null> {
    return await this.model.findByIdAndUpdate(id,
      { $pull: { resumeKeys: resumeKey } },
      { new: true }
    );
  }
}
