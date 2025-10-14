import { Container } from 'inversify';
import { Common, Repositories } from "./symbols";
import { TokenManager } from '@/shared/services/token-manager';

export function bindCommon(container: Container) {
    container.bind(Common.TokenManager).to(TokenManager).inSingletonScope();
}