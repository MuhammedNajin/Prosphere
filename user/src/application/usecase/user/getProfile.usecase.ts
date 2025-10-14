import { Repositories } from "@/di/symbols";
import { IUser } from "@/domain/interface/IUser";
import { IUserRepository } from "@/infrastructure/interface/repository/IUserRepository";
import { BadRequestError } from "@muhammednajinnprosphere/common";
import { inject, injectable } from "inversify";

@injectable()
export class GetProfileUseCase {
  constructor(
    @inject(Repositories.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(id: string): Promise<IUser | null> {
    const user = await this.userRepository.findById(id)

    if(!user) {
       throw new BadRequestError('user not found', "USER_NOT_FOUND");
    }

    return user;
  }
}