import { injectable, inject } from "inversify";
import { IAuthRepository } from "@/infrastructure/interface/repository/IAuthRepository";
import { IAuth } from "@/domain/interface/IAuth";
import { IHashService } from "@infrastructure/interface/service/IHashService";
import { ITokenService } from "@/infrastructure/interface/service/ITokenService";
import { ROLE } from "@/shared/types/enums";
import { UserWithAuthToken } from "@/shared/types/user-with-auth-token";
import { Auth } from "@/domain/entities/auth";
import { Repositories, Services } from "@/di/symbols";
import { BadRequestError, ForbiddenError, UserNotFoundError } from "@muhammednajinnprosphere/common";
import { ErrorCode } from "@/shared/constance";

@injectable()
export class SigninUseCase {
  constructor(
    @inject(Repositories.UserRepository)
    private userRepository: IAuthRepository,
    @inject(Services.HashService) private hashService: IHashService,
    @inject(Services.TokenService) private tokenService: ITokenService
  ) {}

  /**
   * Authenticates a user by email and password, checks if the user is blocked, and returns authentication tokens with user info.
   *
   * @param input - Object containing the user's email and password.
   * @returns An object with the authenticated user and their tokens.
   * @throws Error if the user is not found, password is invalid, or the user is blocked.
   */
  async execute({
    email,
    password,
  }: Pick<IAuth, "email" | "password">): Promise<UserWithAuthToken> {
    const userData = await this.userRepository.findByEmail(email);

    if (!userData) {
      throw new UserNotFoundError()
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

    const isPasswordValid = await this.hashService.compare(
      password!,
      user.password!
    );

    if (!isPasswordValid) {
      throw new BadRequestError(
        'Invalid password',
        ErrorCode.INVALID_PASSWORD,
        'password'
      )
    }

    if (user.canLogin()) {
        throw new ForbiddenError(
          'User is blocked',
          ErrorCode.USER_BLOCKED,
        )
    }

    const tokenPayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: ROLE.USER,
    };

    const accessToken = this.tokenService.generateAccessToken(tokenPayload);
    const refreshToken = this.tokenService.generateRefreshToken(tokenPayload);

    return { accessToken, refreshToken, user };
  }
}
