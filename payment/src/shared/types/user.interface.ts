import { ICompany } from "./company.interface";
export interface IUser {
    id: number;
    userId: string;
    email: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface ICreateUserDto {
    userId: string;
    email: string;
    username: string;
}