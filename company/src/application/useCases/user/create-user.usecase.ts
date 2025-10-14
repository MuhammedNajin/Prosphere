import { Repositories } from "@/di/symbols";
import { User } from "@/domain/entities/user";
import { IUser } from "@/domain/interface/IUser";
import { IUserRepository } from "@/infrastructure/interface/repositories/IUserRepository";
import { ErrorCode } from "@/shared/constance";
import { BadRequestError } from "@muhammednajinnprosphere/common";
import { inject, injectable } from "inversify";

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject(Repositories.UserRepository) private userRepository: IUserRepository
  ) {
    if (!userRepository) {
      throw new Error("CreateUserUseCase initialization error: 'userRepository' is required.");
    }
  }

  async execute(user: IUser): Promise<IUser> {
    const userDomain = User.create(user)
    const existingUser = await this.userRepository.findByEmail(userDomain.email);
    if (existingUser) {
      throw new BadRequestError(
        `User with email '${user.email}' already exists.`,
        ErrorCode.USER_ALREADY_EXISIT
      );
    }
    return await this.userRepository.create(userDomain.toDTO());
  }
}