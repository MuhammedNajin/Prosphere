import { IUserEntity} from '@/domain/interface/IEntity.js';
import { IUserCreationUseCase } from '../../interface/userUsecase_interface'
import { IUserRepository } from '@domain/interface/IUserRepository'

export class UserCreationUseCase implements IUserCreationUseCase {
    constructor (private companyRepository: IUserRepository) {}

    async execute(user: IUserEntity): Promise<IUserEntity | null> {
        return  await this.companyRepository.create(user);  
    }
}