import { User } from '@infra/database/mongo';
import { IUserEntity } from '@domain/interface/IEntity';


export class UserCreationRepository {
     
    static async create(user: IUserEntity): Promise<IUserEntity | null> {
        return await User.build(user).save();
    }
}