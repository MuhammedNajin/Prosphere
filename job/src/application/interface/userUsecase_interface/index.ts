import { IUserEntity } from '@/domain/interface/IEntity';

export interface IUserCreationUseCase {
    execute(job: IUserEntity): Promise<IUserEntity | null>;
}