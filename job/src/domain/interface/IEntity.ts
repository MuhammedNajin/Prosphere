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

export interface IApplicationEntity {
  jobId: string;
  applicantId: string;
  coverLetter: string;
  status:
    | "Applied"
    | "In Review"
    | "Interview Scheduled"
    | "Accepted"
    | "Rejected";
  appliedAt?: Date;
  updatedAt?: Date;
  notes: string;
}
