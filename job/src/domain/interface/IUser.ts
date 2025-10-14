import { UserRole } from "@muhammednajinnprosphere/common";

export interface IUser {
  id: string;
  username: string;
  email: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
  headline?: string;
  profileImageKey?: string;
  coverImageKey?: string;
  createdAt: Date;
  updatedAt: Date;
}
