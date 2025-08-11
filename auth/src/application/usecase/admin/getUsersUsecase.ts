import { injectable, inject } from "inversify";
import { IAuthRepository } from "@/infrastructure/interface/repository/IAuthRepository";
import { IAuth } from "@/domain/interface/IAuth";
import { Repositories } from "@/di/symbols";

interface GetUsersUseCaseParams {
   page: number;
   limit: number;
}
@injectable()
export class GetUsersUseCase {
  constructor(
    @inject(Repositories.UserRepository) private userRepository: IAuthRepository
  ) {}

  async execute({ page = 1, limit = 10}: GetUsersUseCaseParams): Promise<{ total: number; users: IAuth[] }> {
    console.log("Fetching users with pagination", { page, limit });
    const { total, auths } = await this.userRepository.findAll(page, limit);
    return { total, users: auths };
  }
}
