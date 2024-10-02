import { IUserEntity } from '@domain/interface/IEntity';

export interface IUserRepository {
    create(job: IUserEntity): Promise<IUserEntity | null>
 }