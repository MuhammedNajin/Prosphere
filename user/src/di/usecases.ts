// di/usecases.ts
import { Container } from 'inversify';
import { CreateUserUseCase } from '@/application/usecase/user/createUser.usecase';
import { GetProfileUseCase } from '@application/usecase/user/getProfile.usecase';
import { UpdateProfileUseCase } from '@application/usecase/user/updateProfile.usecase';
import { AboutUseCase } from '@application/usecase/user/about.usecase';
import { SearchUserUseCase } from '@application/usecase/user/searchUser.usecase';
import { UploadProfilePhotoUseCase } from '@application/usecase/user/uploadImage.usecase';
import { UploadResumeUseCase } from '@application/usecase/user/uploadResume.usecase';
import { GetUploadedFileUseCase } from '@application/usecase/user/getUploadedFile.usecase';
import { DeleteFileUseCase } from '@application/usecase/user/deleteFile.usecase';
import { DeleteResumeUseCase } from '@application/usecase/user/deleteResume.usecase';
import { UseCases } from './symbols';

export function bindUseCases(container: Container) {
    // User Profile UseCases
    container.bind(UseCases.CreateUserUseCase).to(CreateUserUseCase).inSingletonScope();
    container.bind(UseCases.GetProfileUseCase).to(GetProfileUseCase).inSingletonScope();
    container.bind(UseCases.UpdateProfileUseCase).to(UpdateProfileUseCase).inSingletonScope();
    container.bind(UseCases.AboutUseCase).to(AboutUseCase).inSingletonScope();
    container.bind(UseCases.SearchUserUseCase).to(SearchUserUseCase).inSingletonScope();
    
    // File Upload UseCases
    container.bind(UseCases.UploadProfilePhotoUseCase).to(UploadProfilePhotoUseCase).inSingletonScope();
    container.bind(UseCases.UploadResumeUseCase).to(UploadResumeUseCase).inSingletonScope();
    container.bind(UseCases.GetUploadedFileUseCase).to(GetUploadedFileUseCase).inSingletonScope();
    container.bind(UseCases.DeleteFileUseCase).to(DeleteFileUseCase).inSingletonScope();
    container.bind(UseCases.DeleteResumeUseCase).to(DeleteResumeUseCase).inSingletonScope();
}