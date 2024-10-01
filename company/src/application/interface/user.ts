export interface IUser {
  username: string;
  email: string;
  phone: string;
  password: string;
  jobRole: string;
  avatar?: string | null;
  about?: string | null;
  coverImage?: string | null;
  profilePhoto?: string | null;
}
