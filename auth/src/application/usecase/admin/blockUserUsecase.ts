import { injectable, inject } from "inversify";
import { IAuthRepository } from "@/infrastructure/interface/repository/IAuthRepository";
import { IAuth } from "@/domain/interface/IAuth";
import { Repositories } from "@/di/symbols";
import { NotFoundError } from "@muhammednajinnprosphere/common";


@injectable()
export class BlockUserUseCase {
  constructor(
    @inject(Repositories.UserRepository) private userRepository: IAuthRepository
  ) {}

  /**
   * Toggles the block status of a user.
   * @param userId The ID of the user to block or unblock.
   * @returns The updated user object.
   * @throws {NotFoundError} If the user with the given ID is not found.
   */
  async execute(userId: string): Promise<IAuth> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      // Use NotFoundError with a specific error code
      throw new NotFoundError("User not found", "USER_NOT_FOUND");
    }

    user.isBlocked = !user.isBlocked;
    await this.userRepository.update(userId, user);

    return user;
  }
}
