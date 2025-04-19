import { IApplicationEntity } from "@/domain/interface/IEntity";

export interface ApplicationFilter {
    filter?: string;
    page: number;
    pageSize: number;
    search: string;
}

export interface GetAllApplicationReturnType {
     applications: IApplicationEntity[];
     total: number;
}