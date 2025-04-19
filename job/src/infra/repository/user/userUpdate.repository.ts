import { User } from '@infra/database/mongo';


export class UserUpdateRepository {
     
    static async updateUser(_id: string, query: object) {
        try {
            await User.updateOne({ _id }, query)
        } catch (error) {
            console.log("error", error);
            throw error;
        }
    }
}