import { ISubscription } from "./subscription.interface";
import { IUser } from "./user.interface";

export interface ICompanyContactInfo {
    address: string;
    phone: string;
    website: string;
}

export interface ICompany {
    id: number;
    companyId: string;
    name: string;
    description?: string;
    logo?: string;
    contactInfo?: ICompanyContactInfo;
    owner: IUser;
    createdAt?: Date;
    updatedAt?: Date;
}