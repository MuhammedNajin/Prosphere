import { UserProps } from '@domain/interface/IUser'

export interface IUserRepository {

    createUser(userDTO: UserProps): Promise<UserProps>
} 