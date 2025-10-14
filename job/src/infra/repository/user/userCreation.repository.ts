
import { UserModel } from '@/infra/database/mongo/schema/user.shema';
import { IUserEntity } from '@domain/interface/IEntity';


export class UserCreationRepository {
     
    static async create(user: IUserEntity): Promise<IUserEntity | null> {
        console.log("Creating user in repository:", user);
        return await UserModel.build(user).save();
    }
}