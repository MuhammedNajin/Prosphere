import { Repositories } from "@/di/symbols";
import { IUser } from "@/domain/interface/IUser";
import { IUserRepository } from "@/infrastructure/interface/repository/IUserRepository";
import { inject, injectable } from "inversify";


export interface AboutUseCaseParam { 
  description: string; 
  id: string 
}
@injectable()
export class AboutUseCase {
  constructor(
    @inject(Repositories.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute({ description, id }: AboutUseCaseParam): Promise<IUser | null> {
    return await this.userRepository.update(id, { about: description });
  }
}