import { IApplicationEntity } from "@/domain/interface/IEntity";

export interface ICreateApplicationUseCase {
    execute(application: IApplicationEntity): Promise<IApplicationEntity | null>;
}


export default interface {
    createApplicationUseCase: ICreateApplicationUseCase;
}