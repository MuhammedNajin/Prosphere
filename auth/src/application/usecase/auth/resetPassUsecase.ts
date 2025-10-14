import { injectable, inject } from 'inversify';
import { IAuthRepository } from '@/infrastructure/interface/repository/IAuthRepository';
import { ICacheService } from '@/infrastructure/interface/service/ICacheService';
import { Repositories, Services } from '@/di/symbols';
import { BadRequestError, NotFoundError } from '@muhammednajinnprosphere/common';
import { IHashService } from '@/infrastructure/interface/service/IHashService';


/**
 * Defines the input structure for the ResetPasswordUseCase.
 */
interface ResetPasswordUseCaseInput {
  email: string;
  newPassword: string;
  token: string;
}

@injectable()
export class ResetPasswordUseCase {
  constructor(
    @inject(Repositories.UserRepository) private userRepository: IAuthRepository,
    @inject(Services.CacheService) private cacheService: ICacheService,
    @inject(Services.HashService) private hashService: IHashService
  ) {}

  /**
   * Executes the password reset logic.
   * @param {ResetPasswordUseCaseInput} input - The user's email, new password, and reset token.
   * @throws {NotFoundError} If the user with the given email is not found.
   * @throws {BadRequestError} If the password reset token is invalid or mismatched.
   */
  async execute({ email, newPassword, token }: ResetPasswordUseCaseInput): Promise<void> {
    // 1. Check if the user exists first (best practice for password resets).
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
        throw new NotFoundError(`User with email '${email}' not found.`);
    }

    // 2. Retrieve the expected token from the cache
    const cacheKey = `${email}-token`;
    const cacheToken = await this.cacheService.get(cacheKey);

    console.log(`Cache token for ${email}:`, cacheToken);

    // 3. Validate the token using BadRequestError with specific error codes
    if (!cacheToken) {
      throw new BadRequestError('The password reset link has expired or is invalid.', 'TOKEN_EXPIRED');
    }

    if (token !== cacheToken) {
      throw new BadRequestError('The provided token is invalid.', 'TOKEN_MISMATCH');
    }

    // 4. Update the user's password in the database
    // Note: It is assumed that the password will be hashed by a repository or a pre-save hook.

    const hashPassword = await this.hashService.hash(newPassword)
    await this.userRepository.updateByEmail(email, {
      password: hashPassword,
    });
    
    // 5. Invalidate the token in the cache to prevent reuse
    await this.cacheService.del(cacheKey);
  }
}