import { IApplicationEntity } from "@/domain/interface/IEntity";

export interface ICreateApplicationUseCase {
    execute(application: IApplicationEntity): Promise<IApplicationEntity | null>;
}
export interface IgetAllApplicationUseCase {
    execute(companyId: string): Promise<IApplicationEntity[] | null>;
}


export default interface {
    createApplicationUseCase: ICreateApplicationUseCase;
    getAllApplicationUseCase: IgetAllApplicationUseCase;
}