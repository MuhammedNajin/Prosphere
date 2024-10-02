import { UserCreationRepository } from './userCreation.repository'
import { IUserEntity } from '@domain/interface/IEntity'



export class UserRepository {
    private UserCreationRepo = UserCreationRepository;

    public async create(user: IUserEntity): Promise<IUserEntity | null> {
       return await this.UserCreationRepo.create(user)
    }
}