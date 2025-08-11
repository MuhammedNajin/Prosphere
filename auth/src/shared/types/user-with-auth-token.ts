import { IUser } from "@/domain/interface/IAuth";
import { IAuthToken } from "./auth-token";


export interface UserWithAuthToken extends IAuthToken {
    user: IUser
}