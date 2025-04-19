import { UserCreationRepository } from './userCreation.repository'
import { UserUpdateRepository } from './userUpdate.repository'
import { IUserEntity } from '@domain/interface/IEntity'



export class UserRepository {
    private UserCreationRepo = UserCreationRepository;
    private UserUpdateRepo = UserUpdateRepository;
    public async create(user: IUserEntity): Promise<IUserEntity | null> {
       return await this.UserCreationRepo.create(user)
    }

    public async update(_id: string, query: object): Promise<void> {
        await this.UserUpdateRepo.updateUser(_id, query)
    }

   
}