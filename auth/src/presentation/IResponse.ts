import { IUser } from "@/domain/interface/IAuth";
import { UserRole } from "@muhammednajinnprosphere/common";


export interface SigninResponse {
  id: string;
  email: string;
  username: string;
  phone: string;
  role: UserRole;
  profileImageKey?: string;
  coverImageKey?: string;
  resumeKeys?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminGetUsersResponse {
    users: SigninResponse[];
    total: number;
}