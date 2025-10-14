// di/controllers.ts
import { Container } from 'inversify';
import UserControllers from '@/presentation/controller/user-controller';
import { Controllers } from './symbols';

export function bindControllers(container: Container) {
    console.log('bindControllers: Starting binding...');
    container.bind(Controllers.UserControllers).to(UserControllers).inSingletonScope();
    console.log('bindControllers: UserControllers bound:', container.isBound(Controllers.UserControllers));
}