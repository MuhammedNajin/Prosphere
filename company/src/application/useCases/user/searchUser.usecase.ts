import { Repositories } from "@/di/symbols";
import { IUser } from "@/domain/interface/IUser";
import { IUserRepository } from "@/infrastructure/interface/repositories/IUserRepository";
import { inject, injectable } from "inversify";


@injectable()
export class SearchUserUseCase {
  constructor(
    @inject(Repositories.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(searchQuery: string, limit: number = 10): Promise<IUser[]> {
    if (!searchQuery || searchQuery.trim() === "") {
      return [];
    }
    return await this.userRepository.search(searchQuery, limit);
  }
}