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



export interface ReplyDoc {
  userId: string;
  commentText: string;
  createdAt: Date;
}

export interface IComment {
  userId: string;
  jobId: string;
  commentText: string;
  replies: ReplyDoc[];
}


export interface IJob {
  jobTitle: string;
  employment: string;
  jobDescription: string;
  jobLocation: string;
  salary: {
    status: boolean;
    from: number;
    to: number;
  };
  vacancies: number;
  experience: string;
  companyId: string;
  expiry: Date;
  responsibility: string[];
  skills: string[];
  qualifications: string[];
  status?: boolean;
  expired?: boolean;
}