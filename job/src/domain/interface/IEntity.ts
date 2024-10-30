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
  id: string;
  companyId: string;
  jobId: string;
  applicantId: string;
  name?: string;
  phone?: string;
  email?: string;
  coverLetter?: string;
  status: 'Applied' | 'Inreview' | 'Shortlisted' | 'Interview' | 'Rejected' | 'Selected';
  resume?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  applicationSeen: boolean;
  interviewSchedules: Array<{
    title: string;
    time: string;
    status: 'Pending' | 'Completed';
    feedback?: string;
    feedbackDescription?: string;
  }>;
  statusDescription: {
    title?: string;
    description?: string;
    joiningDate?: Date;
  };
  interviewDate?: Date;
  appliedAt: Date;
  updatedAt: Date;
}