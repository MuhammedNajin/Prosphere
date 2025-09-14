import { JobFormData } from "./formData";
import { Skill } from "./profile";

export interface Job {
  _id: string;
  jobTitle: string;
  employment: "Full-Time";
  jobDescription: string;
  jobLocation: string;
  minSalary: number;
  maxSalary: number;
  vacancies: number;
  experience: number;
  companyId: {
    _id: string;
    name: string;
    logo: string;
    
  };
  expiry: string;
  responsibility: string[];
  skills: Skill[];
  qualifications: string[];
  niceToHave: string[];
  officeLocation: string;
  status?: boolean;
  expired?: boolean;
  likes: string[]
  createdAt: string;
  salary: {
    from: number;
    to: number;
    status: boolean
  }
}

export interface GetjobByCompanyArgs {
  to: Date;
  from: Date;
  filter: string;
  page: number;
  pageSize?: number;
  companyId?: string;
}

export interface CreateJobProps {
  formData: JobFormData;
  companyId: string;
}

export interface UpdateJobProps extends CreateJobProps {
  id: string;
}


export const ITEMS_PER_PAGE_OPTIONS = [10, 20, 30] as const;
export type ItemsPerPageOption = typeof ITEMS_PER_PAGE_OPTIONS[number];

