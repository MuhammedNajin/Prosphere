import { Container } from 'inversify';
import { CreateCompanyUseCase } from '@/application/usecases/company/createCompany.usecase';
import { GetCompanyByIdUseCase } from '@/application/usecases/company/getCompanyById.usecase';
import { GetCompanyByNameUseCase } from '@/application/usecases/company/getCompanyByname.usecase';
import { GetMyCompanyUseCase } from '@/application/usecases/company/getMyComapany.usecase';
import { UpdateProfileUseCase } from '@/application/usecases/company/UpdateProfile.usecase';
import { UpdateCompanyLogoUseCase } from '@/application/usecases/company/updateCompanylogo.usecase';
import { UploadCompanyVerificationDocsUseCase } from '@/application/usecases/company/uploadVerificationnDocs';
import { AddEmployeeUseCase } from '@/application/usecases/company/addTeam.usecase';
import { GetEmployeesUseCase } from '@/application/usecases/company/getEmployees.usecase';
import { UseCases } from './symbols';
import { CreateUserUseCase } from '@/application/usecases/user/create-user.usecase';
import { SearchUserUseCase } from '@/application/usecases/user/searchUser.usecase';
import { GetCompaniesUseCase } from '@/application/usecases/admin/getCompanies.usecase';
import { ChangeCompanyStatusUseCase } from '@/application/usecases/admin/changeStatus.usecase';
import { GenerateCompanyAccessTokenUseCase } from '@/application/usecases/company/generateCompanyAccessToken.usecase';
import { GetUploadedFileUseCase } from '@/application/usecases/company/getUploadedFiles.usecase';
import { UploadCompanyLogoUseCase } from '@/application/usecases/company/uploadCompanyLogo.usecase';

export function bindUseCases(container: Container) {
    container.bind(UseCases.CreateCompanyUseCase).to(CreateCompanyUseCase).inSingletonScope();
    container.bind(UseCases.GetCompanyByIdUseCase).to(GetCompanyByIdUseCase).inSingletonScope();
    container.bind(UseCases.GetCompanyByNameUseCase).to(GetCompanyByNameUseCase).inSingletonScope();
    container.bind(UseCases.GetMyCompanyUseCase).to(GetMyCompanyUseCase).inSingletonScope();
    container.bind(UseCases.UpdateProfileUseCase).to(UpdateProfileUseCase).inSingletonScope();
    container.bind(UseCases.UpdateCompanyLogoUseCase).to(UpdateCompanyLogoUseCase).inSingletonScope();
    container.bind(UseCases.UploadCompanyVerificationDocsUseCase).to(UploadCompanyVerificationDocsUseCase).inSingletonScope();
    container.bind(UseCases.AddEmployeeUseCase).to(AddEmployeeUseCase).inSingletonScope();
    container.bind(UseCases.GetEmployeesUseCase).to(GetEmployeesUseCase).inSingletonScope();
    container.bind(UseCases.CreateUserUseCase).to(CreateUserUseCase).inSingletonScope();
    container.bind(UseCases.SearchUserUseCase).to(SearchUserUseCase).inSingletonScope();
    container.bind(UseCases.GetCompaniesUseCase).to(GetCompaniesUseCase).inSingletonScope(); // Fixed: was GetCompanyUseCase
    container.bind(UseCases.ChangeCompanyStatusUseCase).to(ChangeCompanyStatusUseCase).inSingletonScope();
    container.bind(UseCases.GenerateCompanyAccessTokenUseCase).to(GenerateCompanyAccessTokenUseCase).inSingletonScope();
    container.bind(UseCases.GetUploadedFileUseCase).to(GetUploadedFileUseCase).inSingletonScope();
    container.bind(UseCases.UploadCompanyLogoUseCase).to(UploadCompanyLogoUseCase).inSingletonScope();

}