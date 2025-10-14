import { Container } from 'inversify';
import { Controllers } from './symbols';
import UserControllers from '@/presentation/controller/user-controller';
import { AdminController } from '@/presentation/controller/admin-controller';
import { CompanyController } from '@/presentation/controller/company-controller';
// import { AuthGrpcService } from '@/presentation/controllers/auth-controller';

export function bindControllers(container: Container) {
    console.log('bindControllers: Starting binding...');
    // container.bind(GrpcServices.AuthGrpcService).to(AuthGrpcService).inSingletonScope();
    container.bind(Controllers.UserControllers).to(UserControllers).inSingletonScope();
    container.bind(Controllers.AdminControllers).to(AdminController).inSingletonScope();
    container.bind(Controllers.CompanyControllers).to(CompanyController).inSingletonScope();
    console.log('bindControllers: AuthControllers bound:', container.isBound(Controllers.UserControllers));
    console.log('bindControllers: AdminControllers bound:', container.isBound(Controllers.AdminControllers));
}