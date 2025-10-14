import { Repositories } from "@/di/symbols";
import { User } from "@/domain/entities/user";
import { IUser } from "@/domain/interface/IUser";
import { IUserRepository } from "@/infrastructure/interface/repository/IUserRepository";
import { inject, injectable } from "inversify";

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject(Repositories.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(user: Partial<IUser>): Promise<IUser> {
     const userDomain = User.create(user)
     return await this.userRepository.create(userDomain.toDto());
  }
}