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
    description: string;
    logo: string;
    owner: IUser;
    subscription: ISubscription
    createdAt: Date;
    updatedAt: Date;
}