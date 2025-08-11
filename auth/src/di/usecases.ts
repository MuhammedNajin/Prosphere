// di/usecases.ts
import { Container } from 'inversify';
import { SignupUseCase } from '@application/usecase/auth/signup.usecase';
import { SigninUseCase } from '@application/usecase/auth/signin.usecase';
import { ResetPasswordUseCase } from '@application/usecase/auth/resetPassUsecase';
import { VerifyOtpUseCase } from '@application/usecase/auth/verify-otp.usecase';
import { GoogleAuthUseCase } from '@application/usecase/auth/google-auth.usecase';
import { GoogleAuthFlowUseCase } from '@application/usecase/auth/google-auth-flow.usecase';
import { ForgetPasswordUseCase } from '@application/usecase/auth/forget-pass.usecase';
import { ChangePasswordUseCase } from '@application/usecase/auth/change-password.usecase';
import { AdminLoginUseCase } from '@application/usecase/admin/admin-login.usecase';
import { BlockUserUseCase } from '@application/usecase/admin/blockUserUsecase';
import { GetUsersUseCase } from '@application/usecase/admin/getUsersUsecase';
import { RefreshTokenUseCase } from '@application/usecase/auth/refresh-token.usecase';
import { UseCases } from './symbols';

export function bindUseCases(container: Container) {
    container.bind(UseCases.SignupUseCase).to(SignupUseCase).inSingletonScope();
    container.bind(UseCases.SigninUseCase).to(SigninUseCase).inSingletonScope();
    container.bind(UseCases.ResetPasswordUseCase).to(ResetPasswordUseCase).inSingletonScope();
    container.bind(UseCases.VerifyOtpUseCase).to(VerifyOtpUseCase).inSingletonScope();
    container.bind(UseCases.GoogleAuthUseCase).to(GoogleAuthUseCase).inSingletonScope();
    container.bind(UseCases.GoogleAuthFlowUseCase).to(GoogleAuthFlowUseCase).inSingletonScope();
    container.bind(UseCases.ForgetPasswordUseCase).to(ForgetPasswordUseCase).inSingletonScope();
    container.bind(UseCases.ChangePasswordUseCase).to(ChangePasswordUseCase).inSingletonScope();
    container.bind(UseCases.RefreshTokenUseCase).to(RefreshTokenUseCase).inSingletonScope();
    container.bind(UseCases.AdminLoginUseCase).to(AdminLoginUseCase).inSingletonScope();
    container.bind(UseCases.BlockUserUseCase).to(BlockUserUseCase).inSingletonScope();
    container.bind(UseCases.GetUsersUseCase).to(GetUsersUseCase).inSingletonScope();
    container.bind(UseCases.AdminRefreshTokenUseCase).to(RefreshTokenUseCase).inSingletonScope();
}