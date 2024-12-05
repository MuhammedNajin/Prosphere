import { Repository } from "typeorm";
import { AppDataSource } from "../database/sql/connection";
import { IUser } from "@/shared/types/user.interface"
import { User } from "../database/sql/entities/user.entity";
import { IUserRepository } from "@/domain/IRespository/IUser.repository";


class UserRepository implements IUserRepository {
    private repository: Repository<User>

    constructor() {
         this.repository = AppDataSource.getRepository(User)
    }

    private handleDBError() {
         
    }

    async create(userDTO: IUser) {
         const user = this.repository.create(userDTO);
         return await this.repository.save(user);
    }
}


export default new UserRepository()