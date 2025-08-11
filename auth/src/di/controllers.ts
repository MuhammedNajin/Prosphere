// di/controllers.ts
import { Container } from 'inversify';
import AuthControllers from '@/presentation/controllers/authController';
import AdminControllers from '@/presentation/controllers/adminController';
import { Controllers, GrpcServices } from './symbols';
import { AuthGrpcService } from '@/presentation/controllers/auth-controller';

export function bindControllers(container: Container) {
    console.log('bindControllers: Starting binding...');
    container.bind(GrpcServices.AuthGrpcService).to(AuthGrpcService).inSingletonScope();
    container.bind(Controllers.AuthControllers).to(AuthControllers).inSingletonScope();
    container.bind(Controllers.AdminControllers).to(AdminControllers).inSingletonScope();
    console.log('bindControllers: AuthControllers bound:', container.isBound(Controllers.AuthControllers));
    console.log('bindControllers: AdminControllers bound:', container.isBound(Controllers.AdminControllers));
}