import { IApplicationEntity } from "@/domain/interface/IEntity";

export interface ICreateApplicationUseCase {
    execute(application: IApplicationEntity): Promise<IApplicationEntity | null>;
}
export interface IgetAllApplicationUseCase {
    execute(companyId: string): Promise<IApplicationEntity[] | null>;
}
export interface IgetApplicationUseCase {
    execute(id: string): Promise<IApplicationEntity | null>;
}
export interface IChangeApplicationStatusUseCase {
    execute(id: string, status: string, statusDescription: Object): Promise<null>
}




export default interface {
    createApplicationUseCase: ICreateApplicationUseCase;
    getAllApplicationUseCase: IgetAllApplicationUseCase;
    changeApplicationStatusUseCase: IChangeApplicationStatusUseCase,
    getApplicationUseCase: IgetApplicationUseCase,
}