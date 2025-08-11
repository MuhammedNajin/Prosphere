import { injectable, inject } from "inversify";
import { IAuthRepository } from "@/infrastructure/interface/repository/IAuthRepository";
import { IAuth } from "@/domain/interface/IAuth";
import { IHashService } from "@infrastructure/interface/service/IHashService";
import { ITokenService } from "@/infrastructure/interface/service/ITokenService";
import { ROLE } from "@/shared/types/enums";
import { UserWithAuthToken } from "@/shared/types/user-with-auth-token";
import { Auth } from "@/domain/entities/auth";
import { Repositories, Services } from "@/di/symbols";

import { ErrorCode } from "@/shared/constance";
import { BadRequestError, ForbiddenError, NotFoundError } from "@muhammednajinnprosphere/common";

@injectable()
export class AdminLoginUseCase {
  constructor(
    @inject(Repositories.UserRepository)
    private userRepository: IAuthRepository,
    @inject(Services.HashService) private hashService: IHashService,
    @inject(Services.TokenService) private tokenService: ITokenService
  ) {}

  /**
   * Authenticates a user by email and password, checks for admin status and block status,
   * and returns authentication tokens with user info.
   *
   * @param input - Object containing the user's email and password.
   * @returns An object with the authenticated user and their tokens.
   * @throws {NotFoundError} if the user is not found.
   * @throws {BadRequestError} if the password is invalid.
   * @throws {ForbiddenError} if the user is blocked or not an admin.
   */
  async execute({
    email,
    password,
  }: Pick<IAuth, "email" | "password">): Promise<UserWithAuthToken> {
    const userData = await this.userRepository.findByEmail(email);

    if (!userData) {
      // Use NotFoundError for a non-existent user
      throw new NotFoundError("No Existing Acoount", "USER_NOT_FOUND");
    }

    const user = Auth.create({
      id: userData.id,
      username: userData.username,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
      password: userData.password,
      isVerified: userData.isVerified,
      isBlocked: userData.isBlocked,
    });

    // Check if the user's role is admin before proceeding with password validation
    if (!user.isAdmin()) {
      // Throw ForbiddenError if the user is not an admin
      throw new ForbiddenError("Unauthorized access: User is not an admin.", 'ADMIN_ACCESS_REQUIRED');
    }
    

    const isPasswordValid = await this.hashService.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      throw new BadRequestError("Invalid password", ErrorCode.INVALID_PASSWORD, 'password');
    }
    
    if (!user.canLogin()) {
      throw new ForbiddenError("User is blocked from logging in.", ErrorCode.USER_BLOCKED);
    }


    const tokenPayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.tokenService.generateAccessToken(tokenPayload);
    const refreshToken = this.tokenService.generateRefreshToken(tokenPayload);

    return { accessToken, refreshToken, user };
  }
}
