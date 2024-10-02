export interface ICompanyEntity {
  readonly id?: string;
  name: string;
  owner: string;
  location: string;
}

export interface IUserEntity {
  readonly id?: string;
  username: string;
  email: string;
  phone?: string;
  jobRole?: string;
}
