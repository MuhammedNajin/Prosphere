import { Container } from 'inversify';
import { AuthRepository } from "@/infrastructure/database/mongo/repository/auth.repository";
import { Repositories } from "./symbols";
import { RefreshTokenRepository } from '@/infrastructure/database/mongo/repository/refresh-token.repository';

export function bindRepositories(container: Container) {
    container.bind(Repositories.UserRepository).to(AuthRepository).inSingletonScope();
    container.bind(Repositories.RefreshTokenRepository).to(RefreshTokenRepository).inSingletonScope();
}