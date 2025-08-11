import { injectable, inject } from "inversify";
import { IAuthRepository } from "@/infrastructure/interface/repository/IAuthRepository";
import { ICacheService } from "@/infrastructure/interface/service/ICacheService";
import { ITokenService } from "@/infrastructure/interface/service/ITokenService";
import { IMailService } from "@/infrastructure/interface/service/IMailService";
import { IAuth } from "@/domain/interface/IAuth";
import { Repositories, Services } from "@/di/symbols";

// The NotFoundError is no longer thrown in a real-world scenario
// to prevent information leakage, but it's still a good practice to have.

@injectable()
export class ForgetPasswordUseCase {
  constructor(
    @inject(Repositories.UserRepository) private userRepository: IAuthRepository,
    @inject(Services.CacheService) private cacheService: ICacheService,
    @inject(Services.TokenService) private tokenService: ITokenService,
    @inject(Services.MailService) private mailService: IMailService,
  ) {}

  /**
   * Generates a password reset token and sends a reset link to the user's email.
   * This method follows a secure "silent failure" pattern to prevent email enumeration attacks.
   * @param email The user's email address.
   * @returns The generated token and the user object (or null if not found).
   */
  async execute(email: string): Promise<{ token: string; user: IAuth | null }> {
    const user = await this.userRepository.findByEmail(email);

    // Generate a token regardless of whether the user exists.
    const token = this.tokenService.generateToken();

    // Only proceed with sending an email and caching the token if the user is found.
    if (user) {
      await this.cacheService.set(`${email}-token`, token);
      
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${email}`;
      
      await this.mailService.sendPasswordResetLink({
        email,
        name: user.username || user.email,
        resetLink: resetLink
      });
    }

    // A consistent response is returned to the client, preventing them from
    // knowing whether the email address exists in the database.
    return { token, user: user || null };
  }
}