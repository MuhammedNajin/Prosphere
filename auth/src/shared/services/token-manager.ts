import { injectable, inject } from "inversify";
import { IRefreshTokenRepository } from "@/infrastructure/interface/repository/IRefreshTokenRepository";
import { IJwtUserData, ITokenService } from "@/infrastructure/interface/service/ITokenService";
import { IAuth } from "@/domain/interface/IAuth";
import { Services, Repositories } from "@/di/symbols";
import { RefreshToken } from "@/domain/entities/refresh-token";
import { Time } from "@muhammednajinnprosphere/common";


export type RefreshTokenPayload = IJwtUserData & { tokenId: string };

@injectable()
export class TokenManager {
  constructor(
    @inject(Services.TokenService) private tokenService: ITokenService,
    @inject(Repositories.RefreshTokenRepository) private refreshTokenRepository: IRefreshTokenRepository
  ) {}

  async issueTokens(user: IAuth, ipAddress: string, userAgent: string) {

    const tokenPayload = {
      userId: user.id!,
      username: user.username,
      email: user.email,
      role: user.role,
      tokenId: ''
    };

    const refreshTokenId = this.refreshTokenRepository.generateId()
    const accessToken = this.tokenService.generateAccessToken(tokenPayload);
    const refreshToken = this.tokenService.generateRefreshToken<RefreshTokenPayload>({
       ...tokenPayload,
       tokenId: refreshTokenId
    });

   const EXPIRE_AT = new Date(Date.now() + Time.DAYS * 7);

    const refreshTokenDto = RefreshToken.createWithUserAgent(
      user.id!,
      refreshToken,
      EXPIRE_AT,
      userAgent,
      ipAddress,
      refreshTokenId,
    );

    await this.refreshTokenRepository.create(refreshTokenDto.toDTO());

    return { accessToken, refreshToken };
  }
}
