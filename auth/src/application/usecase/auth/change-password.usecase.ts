import { injectable, inject } from "inversify";
import { IAuthRepository } from "@/infrastructure/interface/repository/IAuthRepository";
import { IHashService } from "@/infrastructure/interface/service/IHashService";
import { Repositories, Services } from "@/di/symbols";

import { ErrorCode } from "@/shared/constance";
import { BadRequestError, NotFoundError, UserNotFoundError } from "@muhammednajinnprosphere/common";

@injectable()
export class ChangePasswordUseCase {
  constructor(
    @inject(Repositories.UserRepository) private userRepository: IAuthRepository,
    @inject(Services.HashService) private hashService: IHashService
  ) {}

  async execute(oldPassword: string, newPassword: string, id: string): Promise<any> {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new UserNotFoundError();
      }

  
      const isOldPasswordValid = await this.hashService.compare(oldPassword, user.password);
      if (!isOldPasswordValid) {
        // Use BadRequestError for a validation failure of the input password
        throw new BadRequestError("Old password is incorrect", ErrorCode.INVALID_PASSWORD, 'oldPassword');
      }

      const hashedNewPassword = await this.hashService.hash(newPassword);
      const updatedUser = await this.userRepository.update(id, { password: hashedNewPassword });
      
      return updatedUser;
  }
}