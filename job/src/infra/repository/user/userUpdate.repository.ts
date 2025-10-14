import { UserModel } from "@/infra/database/mongo/schema/user.shema";



export class UserUpdateRepository {
     
    static async updateUser(_id: string, query: object) {
        try {
            await UserModel.updateOne({ _id }, query)
        } catch (error) {
            console.log("error", error);
            throw error;
        }
    }
}