import { IApplicationEntity } from "@/domain/interface/IEntity";
import { ApplicationFilter, GetAllApplicationReturnType } from "@/shared/types/application";

export interface ICreateApplicationUseCase {
    execute(application: IApplicationEntity): Promise<IApplicationEntity | null>;
}
export interface IgetAllApplicationUseCase {
    execute(companyId: string, params: ApplicationFilter): Promise<GetAllApplicationReturnType | null>;
}
export interface IgetApplicationUseCase {
    execute(id: string): Promise<IApplicationEntity | null>;
}

export interface IisAppliedUseCase {
    execute(id: string, jobId: string): Promise<IApplicationEntity | null>;
}
export interface IgetMyApplicationUseCase {
    execute(params: { userId: string, filter: string, search: string, page: number, pageSize: number }): Promise<IApplicationEntity[] | null>;
}
export interface IChangeApplicationStatusUseCase {
    execute(id: string, status: string, statusDescription: Object): Promise<null>
}




export default interface {
    createApplicationUseCase: ICreateApplicationUseCase;
    getAllApplicationUseCase: IgetAllApplicationUseCase;
    changeApplicationStatusUseCase: IChangeApplicationStatusUseCase,
    getApplicationUseCase: IgetApplicationUseCase,
    getMyApplicationUseCase: IgetMyApplicationUseCase,
    isAppliedUseCase: IisAppliedUseCase
}