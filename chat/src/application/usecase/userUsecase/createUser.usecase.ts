
import { User } from '@domain/entity/user.entity'
import { IUserRepository } from '@/shared/interface/IUserRepository';
import { UserProps } from '@/domain/interface/IUser';


export class CreateUserUseCase {
  
     constructor(private userRepo: IUserRepository) {}

     public async execute(UserDTO: UserProps) {
         const user = new User(UserDTO); 
         return this.userRepo.createUser(UserDTO);
     }
}