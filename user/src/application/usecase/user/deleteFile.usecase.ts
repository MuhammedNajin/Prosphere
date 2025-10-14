import { Repositories, Services } from "@/di/symbols";
import { IUserRepository } from "@/infrastructure/interface/repository/IUserRepository";
import { ICloudStorageService } from "@/infrastructure/interface/service/ICloud-storage.service";
import { inject, injectable } from "inversify";

@injectable()
export class DeleteFileUseCase {
  constructor(
    @inject(Repositories.UserRepository) private userRepository: IUserRepository,
    @inject(Services.CloudStorageService) private cloudStorageService: ICloudStorageService
  ) {}

  async execute(key: string): Promise<void> {
    await this.cloudStorageService.delete(key)
  }
}