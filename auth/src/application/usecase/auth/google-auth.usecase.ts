import { injectable, inject } from "inversify";
import { IAuthRepository } from "@/infrastructure/interface/repository/IAuthRepository"; // Assuming User type is exported
import { ITokenService } from "@/infrastructure/interface/service/ITokenService"; // Assuming GooglePayload type is exported
import { IAuth } from "@/domain/interface/IAuth";
import { ICacheService } from "@/infrastructure/interface/service/ICacheService";
import { AuthProvider, ErrorCode } from "@/shared/constance";
import { ROLE } from "@/shared/types/enums";
import { Repositories, Services } from "@/di/symbols";
import { UnauthorizedError } from "@muhammednajinnprosphere/common";


@injectable()
export class GoogleAuthUseCase {
  constructor(
    @inject(Repositories.UserRepository) private userRepository: IAuthRepository,
    @inject(Services.TokenService) private tokenService: ITokenService,
    @inject(Services.CacheService) private cacheService: ICacheService,
  ) {}

  /**
   * Generates final access and refresh tokens for an existing user.
   */
  private _createLoginResponse(user: IAuth): GoogleAuthOutput {
    const tokenPayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: ROLE.USER,
    };

    const accessToken = this.tokenService.generateAccessToken(tokenPayload);
    const refreshToken = this.tokenService.generateRefreshToken(tokenPayload);

    return {
      profile_complete: true,
      user,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Executes the Google authentication flow.
   * If the user exists, it logs them in.
   * If the user is new, it returns a temporary signup token to proceed with profile completion.
   * @param token The Google ID token from the client.
   * @returns An object indicating the user's status and providing necessary tokens.
   * @throws Will throw an error if the Google token is invalid.
   */
  async execute(token: string): Promise<GoogleAuthOutput> {
    const payload = await this.tokenService.verifyGoogleAuth(token);

    if (!payload || !payload.email) {
      throw new UnauthorizedError(
        "Invalid or expired Google token.",
         ErrorCode.INVALID_GOOGLE_TOKEN
        );
    }

    const existingUser = await this.userRepository.findByEmail(payload.email);

    if (existingUser) {

      return this._createLoginResponse(existingUser);

    } else {
      const firstName = payload["given_name"];
      const lastName = payload["family_name"];

      const userData = {
         username: `${firstName} ${lastName}`,
         email: payload.email,
         authType: AuthProvider.GOOGLE,
      }

      this.cacheService.set(`${payload.email}-google`, JSON.stringify(userData));

      return {
        profile_complete: false,
        user: null,
      };
    }
  }
}


export type GoogleAuthOutput = {
  profile_complete: true;
  user: IAuth;
  accessToken: string;
  refreshToken: string;
} | {
  profile_complete: false;
  user: null;
};
