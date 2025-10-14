import { Repositories } from "@/di/symbols";
import { IUser } from "@/domain/interface/IUser";
import { IUserRepository } from "@/infrastructure/interface/repository/IUserRepository";
import { BadRequestError } from "@muhammednajinnprosphere/common";
import { inject, injectable } from "inversify";

@injectable()
export class SearchUserUseCase {
  constructor(
    @inject(Repositories.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(search: string): Promise<IUser[]> {

    if (!search || search.trim().length === 0) {
      throw new BadRequestError("Search query is required");
    }
    
    return await this.userRepository.search(search);
  }
}