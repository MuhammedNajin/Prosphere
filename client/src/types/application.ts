import { Skill } from "./profile";

export const STATUS_CONFIG = {
    applied: {
      title: 'Application Status Update',
      buttonText: 'Mark as Applied',
      titlePlaceholder: 'Enter application status title',
      descriptionPlaceholder: 'Enter details about the application'
    },
    inreview: {
      title: 'Application Review',
      buttonText: 'Move to Review',
      titlePlaceholder: 'Enter review status title',
      descriptionPlaceholder: 'Enter review details'
    },
    shortlisted: {
      title: 'Application Shortlist',
      buttonText: 'Shortlist Candidate',
      titlePlaceholder: 'Enter shortlist title',
      descriptionPlaceholder: 'Enter shortlist details'
    },
    interview: {
      title: 'Schedule Interview',
      buttonText: 'Move to Interview',
      titlePlaceholder: 'Enter interview title',
      descriptionPlaceholder: 'Enter interview details'
    },
    selected: {
      title: 'Candidate Selection',
      buttonText: 'Select Candidate',
      titlePlaceholder: 'Enter selection title',
      descriptionPlaceholder: 'Enter selection details'
    },
    rejected: {
      title: 'Candidate Rejection',
      buttonText: 'Reject Application',
      titlePlaceholder: 'Enter rejection title',
      descriptionPlaceholder: 'Enter rejection reason'
    }
  };

export enum ViewType {
   Table_View = 'table',
   Card_View = 'card'
}
export  interface JobApplicationFormProps {
    companyId: string,
    jobId: string,
    onClose:React.Dispatch<React.SetStateAction<boolean>>
}
export interface Applicant {
  _id: string;
  companyId: {
     _id: string;
      name: string;
      logo: string;

  };
  jobData: Job;
  applicantData: Applicants;
  status: ApplicationStatus;
  resume: string;
  applicationSeen: boolean;
  interviewSchedules: any[];
  appliedAt: string;
  updatedAt: string;
  createdAt: string;
}

export interface Job {
  salary: {
    status: boolean;
    from: number;
    to: number;
  };
  _id: string;
  jobTitle: string;
  employment: string;
  jobDescription: string;
  jobLocation: string;
  officeLocation: string;
  vacancies: number;
  experience: string;
  companyId: {
    _id: string;
    name: string;
    logo: string | null;
  };
  expiry: string;
  responsibility: string[];
  skills: Skill[];
  qualifications: string[];
  niceToHave: string[];
  likes: any[]; 
  commentCount: number;
  status: boolean;
  expired: boolean;
  veiws: View[];
  createdAt: string;
  updatedAt: string;
}

export interface View {
  userId: string;
  seenAt: string;
  _id: string;
}

export interface Applicants {
  _id: string;
  username: string;
  email: string;
  phone: string;
  jobRole: string;
  avatar: string;
}

export enum ApplicationStatus {
  All = 'All',
  Applied = 'applied',
  InReview = 'inreview',
  Shortlisted = 'shortlisted',
  Interview = 'interview',
  Rejected = 'rejected',
  Selected = 'selected',
}

export interface RecentApplicationData {
  _id: string;
  companyId: {
    _id: string;
    name: string;
    logo: string | null;
  };

  jobId: {
    _id: string;
    jobTitle: string; 
  };

  status: string;
  appliedAt: string;
}

export type JobApplicationStatus = 'Applied' | 'Inreview' | 'Shortlisted' | 'Interview' | 'Rejected' | 'Selected';


