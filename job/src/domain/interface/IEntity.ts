export interface ICompanyEntity {
  readonly _id?: string;
  name: string;
  owner: string;
  location: string;
}

export interface IUserEntity {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  jobRole?: string;
}
