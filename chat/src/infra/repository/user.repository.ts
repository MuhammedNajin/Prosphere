import { IUserRepository } from "@/domain/IRepository/IUserRepository";
import User, { UserAttrs, UserModel } from "../database/mongo/schema/user.schema";

class UserRepository implements IUserRepository {
    private User = User
    constructor() {}

    /**
     * Creates a new user in the database
     * @param userData The user data to create
     * @returns The created user document
     * @throws Error if user creation fails
     */

    public async createUser(userData: UserAttrs): Promise<UserModel> {
        try {
            const user = new this.User(userData);
            return await user.save();
        } catch (error) {
            throw new Error(`Failed to create user: ${error}`);
        }
    }
}

export default new UserRepository();